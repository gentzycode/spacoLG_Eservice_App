export const formatError = (err) => {

    let emailErr = '';
    let usernameErr = '';
    let password_hashErr = '';

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
    }

    return `${emailErr} ${usernameErr} ${password_hashErr}`;

}