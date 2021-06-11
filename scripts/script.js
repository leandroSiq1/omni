const Modal = {
  toggle() {
    const modal = document.querySelector("#modalTransaction");
    const body = document.body;

    body.style.overflow = "hidden";

    if (modal.classList.length === 2) {
      Form.clear();
      body.style.overflow = "initial";
    };

    modal.classList.toggle("active");
  }
}

const Transaction = {
  all: [
    {
      description: "Bolacha",
      amount: 500,
    },
    {
      description: "Guárana",
      amount: -400,
    },
  ],

  table: document.querySelector("#table"), 

  add(transaction) {
    Transaction.all.push(transaction);
    
    App.reload();
  },

  remove(index) {
    Transaction.all.splice(index, 1);
    
    App.reload();
  },

  income() {
    let income = 0;

    Transaction.all.forEach(transaction => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    });

    return income;
  },

  expense() {
    let expense = 0;

    Transaction.all.forEach(transaction => {
      if (transaction.amount < 0) {
        expense += transaction.amount;
      }
    });

    return expense;
  },

  total() {
    let total = 0;

    total = Transaction.income() + Transaction.expense();

    return total;
  }
}

const Utils = {
  formatAmount(value) {
    const amount = String(value).replace(",", "");

    return Number(amount);
  },

  formatCurrency(value) {
    value = Number(value) / 100;

    value = value.toLocaleString("pr-BR", { style: "currency", currency: "BRL" })
    
    return value;
  }
}

const DOM = {
  addTransaction(transaction, index) {
    const tr = document.createElement("tr");

    tr.innerHTML = DOM.insertInnerHtml(transaction, index);
    
    Transaction.table.appendChild(tr);
  },

  insertInnerHtml(transaction, index) {
    const CSSClass = transaction.amount < 0 ? "expense" : "income";
    
    const amount = Utils.formatCurrency(transaction.amount);

    const HTML = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSClass}">${amount}</td>
      <td class="date">09/06/2021</td>
      
      <td>
        <img style="cursor: pointer;" onclick="Transaction.remove(${index})" src="assets/minus.svg" alt="Remover transação" />
      </td>
    `;

    return HTML;
  },

  updateBalance() {
    document.querySelector("#incomeDisplay").innerHTML = Utils.formatCurrency(Transaction.income());
    document.querySelector("#expenseDisplay").innerHTML = Utils.formatCurrency(Transaction.expense());
    document.querySelector("#totalDisplay").innerHTML = Utils.formatCurrency(Transaction.total());
  }
}

const Form = {
  description: document.querySelector("#description"),
  amount: document.querySelector("#amount"),
  
  submit(event) {
    event.preventDefault();
    
    try {
      Form.validateFields();

      Transaction.add(Form.formatValues());
      
      Form.clear()
      Modal.toggle();

    } catch (error) {
      alert(error);
    }
  },

  validateFields() {
    const { description, amount } = Form.getValues();

    if (description.trim() === "" || amount.trim() === "") {
      throw new Error("Por favor, preencha todos os campos!");
    } 
  },

  clear() {
    Form.description.value = "";
    Form.amount.value = "";
  },

  getValues() { 
    return {
      description: Form.description.value,
      amount: Form.amount.value,
    }
  },

  formatValues() {
    let { description, amount } = Form.getValues();

    amount = Utils.formatAmount(amount);
    
    console.log(amount);
    
    return {
      description,
      amount,
    };
  }
}

const  App = {
  init() {
    Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index);
    });

    DOM.updateBalance();
  },

  reload() {
    Transaction.table.innerHTML = "";
    App.init();
  }
}

App.init();