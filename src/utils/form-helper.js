export const addToForm = (dt) => {
    var formData = new FormData();

    const data = dt

    Object.entries(data).forEach(([key, value], _) => {
        if (value) {
            if (Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value);
            }
        }
    });


    return formData;

}