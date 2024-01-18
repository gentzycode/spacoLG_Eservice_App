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

    return `${emailErr} ${usernameErr}${password_hashErr} ${error}`;

}


export const formatDate = (dt) => {

    const date = new Date(dt);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
  
    return `${monthNames[month]} ${day}, ${year}`;
}


export const formatDateAndTime = (dt) => {

    const date = new Date(dt);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
  
    return `${monthNames[month]} ${day}, ${year} ${hour}:${minutes}:${seconds}`;
}



export const tableCustomStyles = {
    headCells: {
      style: {
          fontSize: '13px',
          fontWeight: 'bold',
          padding: '0 15px',
          justifyContent: 'left',
          backgroundColor: '#c9d8ca'
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
    (role === 'Staff' || role === 'LocalAdmin') && setNavlinks(staff);
    role === 'SuperAdmin' && setNavlinks(superAdmin);
}


export const filterAdminusers = (data) => {
    let filterdata = data.filter(item => item?.role?.name !== 'PublicUser');
    return filterdata;
}


export const statusColor = (flag) => {
    let flagColor;

    if(flag === 'ADD_INFO'){
        flagColor = 'text-[#cb5a5a]';
    }
    else if(flag === 'PAYMENT_REQUIRED'){
        flagColor = 'text-[#53873e]';
    }
    else if(flag === 'AWAITING_PAYMENT_CONFIRMATION'){
        flagColor = 'text-[#3d7fc8]';
    }
    else if(flag === 'INFO_REQ_ADMIN_REVIEW'){
        flagColor = 'text-[#cd7b06]';
    }
    else if(flag === 'REQ_ADMIN_REVIEW'){
        flagColor = 'text-[#cd7b06]';
    }
    else if(flag === 'P_CERT'){
        flagColor = 'text-[#9ddb85]';
    }
    else if(flag === 'D_CERT'){
        flagColor = 'text-[#0bd09b]';
    }

    return flagColor;
}