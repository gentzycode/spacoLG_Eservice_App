export const formatError = (err) => {

    let emailErr = '';
    let usernameErr = '';
    let password_hashErr = '';
    let error = '';

    if(err !== null){
        if(err?.email){
            emailErr = err?.email[0];
        }
        if(err?.username){
            usernameErr = err?.username[0];
        }
        if(err?.password_hash){
            password_hashErr = err?.password_hash[0];
        }
        if(!err?.email && !err?.username && !err?.password_hash){
            error = err
        }
    }

    return `${emailErr} ${usernameErr} ${password_hashErr} ${error}`;

}


export const formatDate = (dateVal) => {

    const date = new Date(dateVal);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-indexed in JavaScript
    const day = date.getDate();

    return `${year}-${month}-${day}`;
}