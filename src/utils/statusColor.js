export const statusColor = (status) => {
    switch (status) {
        case 'pending':
            return 'orange'
        case 'accepted':
            return 'teal'
        case 'delivery in progress':
            return 'blue'
        case 'delivered':
            return 'green'
        case 'cancelled':
            return 'red'
        default:
            return 'orange'
    }
}