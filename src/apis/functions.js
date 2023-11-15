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


export const formatDate = (dt) => {

    const date = new Date(dt);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
  
    return `${monthNames[month]} ${day}, ${year}`;
}



export const tableCustomStyles = {
    headCells: {
      style: {
          fontSize: '13px',
          fontWeight: 'bold',
          padding: '0 15px',
          justifyContent: 'left',
      },
      rows: {
        style: {
            fontWeight: 'bold', 
            color: 'red'
        },
    },
    },
  }


export const setUserLinks = (role, publicUser, staff, superAdmin, setNavlinks) => {

    role === 'PublicUser' && setNavlinks(publicUser);
    role === 'Staff' && setNavlinks(staff);
    role === 'SuperAdmin' && setNavlinks(superAdmin);
}