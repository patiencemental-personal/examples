const setInterceptors = (instance) => {
    instance.interceptors.request.use(
        (config) => {
            return config;
        },
        (error) => {
            return error
        });
    instance.interceptors.response.use(
        (config) => {
            return config;
        },
        (error) => {
            // console.error(error.response)
            return Promise.reject(error.response)
        });
}

export {
    setInterceptors,
}