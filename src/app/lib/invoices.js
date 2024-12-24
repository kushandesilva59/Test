export async function handler() {
     
    const response  = await fetch('http://localhost:8080/invoices');
    console.log(response)
}