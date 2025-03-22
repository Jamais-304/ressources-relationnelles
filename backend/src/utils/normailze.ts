export const normalize = (portBackend: string): string | number | false => {
    const port = parseInt(portBackend, 10) // Convert port in integer
    switch (true) {
        case isNaN(port):
            return portBackend
        case port <= 0:
            throw new Error(`Value cannot be ≤ to 0: ${port}`)
        case port > 0:
            return port
        default:
            return false
    }
}
