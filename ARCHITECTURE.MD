ccs-ticket-app

auth
-client enters simple passcode on frontend
-post request sends passcode to api gateway /login
-a lambda called TicketDriverLogin checks the passcode and assigns a JWT using the crypto library
-api gateway sends back token to client
-protected routes on api gateway down the pipeline, has a custom lambda authorizer called TicketJwtAuthorizer attached, which validates client token

frontend processing

-client uploads ticket image to frontend
-frontend uses open cv to:
-weed out unsupported formats
-turn to grayscale
-reduce noise with Gaussian blur
-edge detection with Canny
-morphological transform
-contour detection and sorting
-ticket area/image area ratio validation
-find largest polygon and simplify to 4-point polygon
-validate ticket width/height ratio
-perform perspective transform
-rotate if ticket is landscape
-frontend displays image for preview

raw upload

-frontend sends image with POST to api gateway /upload-ticket
-TicketJwtAuthorizer authorizes client
-route integration with TicketPresignHandler Lambda:
-grabs user
-generates random ticketId
-fetches and returns S3 presigned URL
-creates record in db with status ‘awaiting-upload’
-client sends PUT to S3 /raw using presigned URL
-client polls TicketDbReader until status says ‘uploaded’, then ‘validated’, then ‘extracted’

cloud validation and extraction

-S3/raw triggers TicketDbWriter Lambda:
-fetches status of ticket from db using ticketId
-updates status to ‘uploaded’ only if status===’awaiting-upload’
-on success:
-publishes to EventBridge 

-EventBridge triggers TicketValidator Lambda:
-updates status to ‘validating’ only if status===’uploaded’
-updates validationStartedAt: timestamp (for TicketStageRecoveryLambda)
-download ticket from S3 /raw
-verify .png
-verify file size
-verify aspect ratio (skip)
-verify blur index (skip)
-OCR just the ticket number using Textract
-check ticket number uniqueness against ccs-ticket-number-db Dynamo table
-if uniqueness check fails
-update status to ‘rejected’ only if status===’validating’
-normalize image size (skip)
-sends PUT to S3 /validated or /rejected
-upon success:
-updates status to ‘validated’ or ’rejected’ only if status===’validating’ in ticket-db
-on success:
-publish EventBridge event:TicketExtractionRequested

-EventBridge triggers TextractLambda Lambda:
-fetches status of ticket from db using ticketId
-updates status to ‘extracting’ only if status===’validated’
-updates lastUpdated: timestamp (for TicketStageRecoveryLambda)
-loads ticket from S3 /validated
-runs Textract
-update data in ticket-db Dynamo table
-update status to ‘extracted’ or ‘failed’ only if status===’extracting’


client polls db state

right after client sends aforementioned PUT to S3, client polls /get-ticket api
-TicketJwtAuthorizer Lambda authorizes token
-route integration with TicketDbReader Lambda:
-(later implement if logged in driver uploads ticket that doesn’t match his truck number, send back error)
-fetch ticket data from db
-if ticket doesn’t exist, return error message
-if ticket driverId doesn’t match requester driverId, send error message
-return atomic ticket status to client to manage polling, make sure failure reason visible
-if status===’extracted’ also send:
-ticket data
-presigned GET URL from S3/validated
client ticket review

-client gets back extracted ticket data + validated ticket image get url
-UI makes the image with extracted fields visible and editable
-client reviews, edits fields
-client sends POST to /confirm-ticket api
-TicketJwtAuthorizer authorizes token
-integration with TicketDbConfirm Lambda:
-updates db with reviewed/edited data
-does a DynamoDB transaction:
-updates status to ‘confirmed’ only if status===’extracted’
-updates ticket-number-db 
-includes calculated hours


-on success:
-publishes to EventBridge


-client polls /get-ticket API until it says ‘populated’


-EventBridge triggers TicketSheetsWriter Lambda
-updates status to ‘populating’ only if status===’confirmed’
-updates populatingStartedAt: timestamp (for TicketStageRecoveryLambda)
-populates Google sheet:
-builds the new row in memory
-uses the following schema from a JS object:
-date-A, customer-B, Job-C, Ticket #-D, Start Time-E, End Time-F, Hours-G, Cashflow-H, Invoice #-I, Filled-J Paid-K, Hourly Rate-L, Driver-M, Truck #-N
-finds the next row that’s empty under the ticket # column, and checks if the date from the previous column matches the date from the current ticket….then records this info in an object…maybe something like const row = {number: 48,  type: “append to invoiced” or “new invoice”}
-based on the type, decides if the invoice # column for this row will be the same as the previous or incremented by one (the format is 26DT###, where the last 3 digits are what need to be incremented)
-populates the date, customer, job, ticketNumber, start, stop, invoice # (this one is not sent by the client, as shown above), filed (this one is a checkbox and needs to just be set to checked), driver, truckNo from the data sent by the client
-performs batch write
-upon success does a dynamo transaction:
-updates status to ‘populated’ in ticket-db only if status is ‘populating’
--updates status to ‘populated’ in ticket-number-db

client polls GET from /get-ticket api	
-integration with TicketDbReader Lambda:
fetch ticket data from db
-if ticket doesn’t exist, return error message
-if ticket driverId doesn’t match requester driverId, send error message
-return atomic ticket status to client to manage polling, make sure failure reason visible
frontend logs out and reloads

admin/welcome route on frontend
	sends GET request to /tickets?status=populated
TicketDb_Reader Lambda:
fetches all tickets with a ‘populated’ status from ccs-ticket-db 
returns confirmedData, confirmedAt, driverId, validatedKey and status for each
	if there are unclosed tickets, admin shows badge above finalize (or generate) button
admin groups invoices by earliest date after clicking on the button
	clicking ‘generate’ invoice sends a POST request to /invoices/generate

 	InvoiceGenerator Lambda gets triggered
-fetches all tickets from ticket-db with status===’populated’ and date==={what client requested} using the status-date-index inside ticket-db
-uses single transaction and updates the statuses of all those tickets in ticket-db to ‘generating invoice’ only if status===’populated’
-if tickets do not pass this operation, lambda exits with error ( will implement recovery lambda later)
-lambda hits https://script.google.com/macros/s/AKfycby1fb2ppet-ZYINa7k7ZRAy6Zrqd8PQ7jFZE0ejaaIcm5HxHM4wSHZk7S6G0viGx7kzdA/exec

	AppsScript gets triggered
makes sure claims of request say ‘ADMIN’
grabs sheetsRow for each ticket
checks the google sheet for those rows and grabs their data
compares each field from Dynamo to Sheets to make sure they’re the same
gets the ticket with the lowest row number and calculates the new invoice number by incrementing the previous one
feeds rows, invoice number and calculated totalHours and totalAmount to an HTML template which lives inside the AppsScript
generates a PDF
uploads PDF to google drive
inputs the new invoice number ino the sheet for the tickets in question and links with the pdf url
sends back success to the Lambda with the pdf url and the new invoice number

	InvoiceGenerator Lambda continued
takes the pdf url sent by apps script
-updates ticket-db invoiceStatus to ‘generated’ and sets invoiceNumber and InvoicePdfKey only if invoiceStatus===’generating’
sends back success to client and includes the pdf url link
