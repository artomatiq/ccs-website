export async function apiFetch(url, options = {}, setToken) {
    const token = sessionStorage.getItem("driverToken")
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    }
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }
    const res = await fetch(url, {
        ...options,
        headers
    })
    if (res.status === 401 || res.status === 403) {
        sessionStorage.removeItem("driverToken")
        setToken(null)
        console.log(res);
        throw new Error("Session expired. Please log in.")
    }
    if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Request failed")
    }
    return res
}