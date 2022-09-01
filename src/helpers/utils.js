
// const validationEmail = (email) => {
//     const response =
//     /^(([^<>()[]\.,;:\s@"]+(.[^<>()[]\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
//     return response.test(String(email).toLocaleLowerCase());


// }

const validationPassword = (password) => {
    const response =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-.]).{8,}$/;
    return   response.test(String(password));

}


const setError = (code, message) => {
    const error = new Error();
    error.code = error;
    error.message = message;
    return error;

}
module.exports = {
    validationPassword,
    setError
}