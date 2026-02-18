

const fullnames = document.getElementById('fullnames');
const Instituitionname = document.getElementById('Instituitionname');
const email =document.getElementById('email');
const courseinput = document.getElementById('courseinput');
const studentid  =document.getElementById('studentid');
const password  =document.getElementById('password');
const registerbtn = document.getElementById('registerbtn');
const registerresults =document.getElementById('registerresults');
const loginlink = document.getElementById('loginlink');
const registerform = document.getElementById('registerform');
const loginform = document.getElementById('loginform');
const loginsection=document.getElementById('loginsection');
const registrationsection=document.getElementById('registrationsection');
const registerlink=document.getElementById('registerlink');
const applicationpage = document.getElementById('applicationpage');
const footer =document.getElementById('footer');


loginform.addEventListener('submit',(e)=>{
    e.preventDefault();
})

registerform.addEventListener('submit',(e)=>{
    e.preventDefault();
})


registerbtn.addEventListener('click',()=>{
    const FULLNAMES = fullnames.value.trim();
    const INSTITUTION= Instituitionname.value.trim();
    const EMAIL = email.value.trim();
    const COURSE =courseinput.value.trim();
    const STUDENTID= studentid.value.trim();
    const PASSWORD =password.value.trim();


    if(FULLNAMES==="" || INSTITUTION===""||EMAIL===""||COURSE===""||STUDENTID===""||PASSWORD===""){
        registerresults.textContent = 'please fill in the field above';
        registerresults.classList.remove('hidden');

        setTimeout(() => {
            registerresults.classList.add('hidden');
        },3000);
        return;
    }
 fetch('/registeruser/register',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    credentials:'include',
    body:JSON.stringify({FULLNAMES,INSTITUTION,EMAIL,COURSE,STUDENTID,PASSWORD})
 })
 .then(res=>res.json())
 .then(data=>{

    if(data.message.includes(`you have been succesfully registered`)){
        registrationsection.classList.add('hidden');
        landingpage.classList.remove('hidden');
        applycta.classList.remove('remove');
        loginsection.classList.remove('hidden');
        loginsection.classList.remove('hidden');
       footer.classList.remove('hidden');
        
    }
    registerresults.classList.remove('hidden');
    registerresults.textContent = data.message;
 })
 .catch(err=>{
     registerresults.classList.remove('hidden');
    registerresults.textContent = err.message;

    setTimeout(() => {
        registerresults.classList.add('hidden');
    }, 3000);
 })
    fullnames.value = "";
Instituitionname.value = "";
email.value = "";
courseinput.value = "";
studentid.value = "";
password.value = "";
})


loginlink.addEventListener('click',()=>{
loginsection.classList.remove('hidden');
registrationsection.classList.add('hidden');

})

registerlink.addEventListener('click',()=>{
loginsection.classList.add('hidden');
registrationsection.classList.remove('hidden');

})


// login

const emailinput = document.getElementById('emailinput');
const passwordinput =document.getElementById('passwordinput');
const loginbtn = document.getElementById('loginbtn');
const loginresults = document.getElementById('loginresults');
const landingpage = document.getElementById('landingpage');
const applycta = document.getElementById('applycta');
const adminpage = document.getElementById('adminpage');

loginbtn.addEventListener('click',()=>{
    const email = emailinput.value.trim();
    const password = passwordinput.value.trim();

    if(!email ||!password){
        loginresults.classList.remove('hidden');
        loginresults.textContent = 'please fill this fields first'

        setTimeout(() => {
        loginresults.classList.add('hidden');
        }, 3000);
        return;
    }

    fetch('/login/loginapi',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    credentials:'include',
    body:JSON.stringify({email,password})
 })
 .then(res=>res.json())
 .then(data=>{
    
       if(data.role==='admin'){
        adminpage.classList.remove('hidden');
        loginsection.classList.add('hidden');
       }else if(data.role==='student'){
        loginsection.classList.add('hidden')
        applylink.classList.remove('hidden');
        landingpage.classList.remove('hidden');
        applicationpage.classList.remove('hidden');
       }else{

        loginresults.classList.remove('hidden');
        loginresults.textContent = data.message;
       }
       
    
 })
 .catch(err=>{
    console.log(err);
    
     loginresults.classList.remove('hidden');
    loginresults.textContent = err.message;

    setTimeout(() => {
        loginresults.classList.add('hidden');
    }, 3000);
 })
emailinput.value="";
 passwordinput.value="";
    
    
})


const startapplicationbtn =document.getElementById('startapplicationbtn');
const applicationform =document.getElementById('applicationform');
const applylink =document.getElementById('applylink');

startapplicationbtn.addEventListener('click',()=>{
    applicationpage.classList.remove('hidden');

})

applylink.addEventListener('click',(e)=>{
    e.preventDefault();
    applicationpage.classList.remove('hidden');
    applicationpage.scrollIntoView({behavior:'smooth'})

});


// application
const applicantfullname = document.getElementById('applicantfullname');
const applicantsid = document.getElementById('applicantsid');
const brthdate = document.getElementById('brthdate');
const selectgender = document.getElementById('selectgender');
const phoneno = document.getElementById('phoneno');
const locationinput = document.getElementById('location');
const Institution = document.getElementById('Institution');
const StudentId = document.getElementById('StudentId');
const course = document.getElementById('course');
const Yearofstudy = document.getElementById('Yearofstudy');
const resultsuplaod = document.getElementById('resultsuplaod');
const Monthlyincone = document.getElementById('Monthlyincone');
const dependants = document.getElementById('dependants');
const reason = document.getElementById('reason');
const idcopy = document.getElementById('idcopy');
const supportingdoc = document.getElementById('supportingdoc');
const uploadmessage = document.getElementById('uploadmessage');
const Declaration = document.getElementById('Declaration');
const submitbtn = document.getElementById('submitbtn');


submitbtn.addEventListener('click',()=>{
    const FULLNAMES = applicantfullname.value.trim();
    const APPLICANTID = applicantsid.value.trim();
    const BIRTHDATE = brthdate.value.trim();
    const SELECTGENDER = selectgender.value.trim();
    const PHONENO = phoneno.value.trim();
    const LOCATION = locationinput.value.trim();
    const INSTITUTION = Institution.value.trim();
    const STUDENTSID = StudentId.value.trim();
    const COURSE = course.value.trim();
    const YEAROFSTUDY = Yearofstudy.value.trim();
    const MONTHLYINCOME = Monthlyincone.value.trim();
    const DEPENDANTS = dependants.value.trim();
    const EMPLOYED = document.querySelector('input[name="employed"]:checked')?.value || '';
    const REASON = reason.value.trim();


    const SUPPORTINGDOC = supportingdoc.files[0];
    const IDCOPY  =idcopy.files[0];
    const RESULTSCORE = resultsuplaod.files[0];


    const formdata=new FormData();
    formdata.append('SUPPORTINGDOC',SUPPORTINGDOC);
    formdata.append('IDCOPY',IDCOPY);
    formdata.append('RESULTSCORE',RESULTSCORE);


    fetch('/applicants/uploadfiles',{
        method:'POST',
        credentials:'include',
        body:formdata,
    }
    ).then(res=>res.json())
    .then(data=>{
        uploadmessage.classList.remove('hidden');
        uploadmessage.textContent = data.message;
    })
    .catch(err=>{
         uploadmessage.classList.remove('hidden');
        uploadmessage.textContent = err.message;
        setTimeout(() => {
            uploadmessage.classList.add('hidden');
        }, 4000);
    })

    fetch('/applicants/applicantscredentials',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        credentials:'include',
        body:JSON.stringify({FULLNAMES, APPLICANTID, BIRTHDATE, SELECTGENDER, PHONENO, LOCATION,
             INSTITUTION, STUDENTSID, COURSE, YEAROFSTUDY, MONTHLYINCOME, DEPENDANTS, EMPLOYED, REASON})
    })
    .then(res=>res.json())
    .then(data=>{
        uploadmessage.classList.remove('hidden');
        uploadmessage.textContent =data.message;
    })
    .catch(err=>{
        uploadmessage.classList.remove('hidden');
        uploadmessage.textContent =err.message;
        
        setTimeout(() => {
            uploadmessage.classList.add('hidden');
        }, 4000);
    })
    applicantfullname.value = "";
applicantsid.value = "";
brthdate.value = "";
selectgender.value = "";
phoneno.value = "";
locationinput.value = "";
Institution.value = "";
StudentId.value = "";
course.value = "";
Yearofstudy.value = "";
resultsuplaod.value = "";
Monthlyincone.value = "";
dependants.value = "";
reason.value = "";
idcopy.value = "";
supportingdoc.value = "";
uploadmessage.value = "";
Declaration.checked = false;
})

// admin
const totalapplication = document.getElementById('totalapplication');
async function gettotalapplicants() {
    try {
        const response = await fetch('/getnames/totalapplicants');
        const data = await response.json();
        totalapplication.textContent = `${data.message} Applicants`;
        
    } catch (error) {
        console.log(error)
        totalapplication.textContent=error.message
    }
}
gettotalapplicants();


// displayintable
const studentstable =document.getElementById('studentstable');

async function diplaytable() {
    try {
        const response =await fetch('/tablefunc/table');
        const data=await response.json();
        studentstable.innerHTML = "";
        data.message.forEach(applicant => {
            
          studentstable.innerHTML+=`
            <td>${applicant.fullnames} </td>
            <td> ${applicant.email}</td>
            <td> ${applicant.institution}</td>  
           <td> ${applicant.course} </td>  
           <td> ${applicant.email } </td>  
           <td> ${new Date(applicant.created_at).toLocaleDateString()}</td>  `
        });
        
        
    } catch (error) {
        console.log(error);
        
    }
}
diplaytable();


const applicationstable = document.getElementById('applicationstable');
async function allapllicants() {
    try {
        const response = await fetch('/allusers/displayapplicants');
        const data = await response.json();
        applicationstable.innerHTML = '';
        data.message.forEach(student => {
            applicationstable.innerHTML+=`
            <td>${student.fullnames}</td>
             <td>${student.institution }</td>
            <td>${student.course}</ td>
            <td>${new Date(student.created_at).toISOString()}</td>
            
            `
        });
        
    } catch (error) {
        console.log(error)
    }
}
allapllicants();


const setbudget = document.getElementById('setbudget');
const totalbudget = document.getElementById('totalbudget');

setbudget.addEventListener('input',()=>{
    const money = setbudget.value.trim();
    fetch('/money/totalbudget',{
        method:'POST',
        headers:{
        'Content-Type':'application/json',
        },
        body:JSON.stringify({money})

    }).then(res=>res.json())
    .then(data=>{
        console.log(data);
        
        totalbudget.textContent = `Ksh${data.message}`;
    })
    .catch(err=>{
         totalbudget.textContent = err.message;
    })
})

const backtolistbtn = document.getElementById('backtolistbtn');

backtolistbtn.addEventListener('click',()=>{
    adminpage.classList.add('hidden');
    applicationpage.scrollIntoView({behavior:'smooth'});
    landingpage.classList.remove('hidden');
    applicationpage.classList.remove('hidden');
})


// const documentlist = document.getElementById('documentlist');
// async function uploadeddocs() {
//     try {
//         const results = await fetch('/money/documents');
//         const data = await results.json();
//         documentlist.textContent = data.message;
        
//     } catch (error) {
//         console.log(error);
        
//     }
// }
// uploadeddocs();

const adminlogoutbtn=document.getElementById('adminlogoutbtn');
adminlogoutbtn.addEventListener('click',()=>{
    fetch('/Logout/logout',{
        method:'POST',
        credentials:'include',
    })
    .then(res=>res.json())
    .then(data=>{
        adminpage.classList.add('hidden');
        loginsection.classList.remove('hidden');

    })
    .catch(err=>{
        console.log(err);
        
    })
})
