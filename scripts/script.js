const Modal = {
  toggle() {
    const modal = document.querySelector("#modalTransaction");
    
    if (modal.classList.length === 2) Form.clear();

    modal.classList.toggle("active");
  }
}

// 2,30
console.log(230 * 100)

const transactions = [
  {
    description: "Bolacha",
    income: 23000,
    expense: 10000,
  },
];

const Form = {
  description: document.querySelector("#description"),
  product: document.querySelector("#product"),
  customer: document.querySelector("#customer"),
  
  clear() {
    Form.description.value = "";
    Form.product.value = "";
    Form.customer.value = "";
  },

  getValue() { 
    return {
      description: Form.description.value,
      product: Form.product.value,
      customer: Form.customer.value,
    }
  }
}