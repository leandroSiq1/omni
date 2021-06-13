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

const Storage = {
  get() {
    const transactions = localStorage.getItem("transactions:merca.finance") || [];

    return JSON.parse(transactions);
  },
  set(transactions) {
    localStorage.setItem("transactions:merca.finance", JSON.stringify(transactions));
  },
}

const Transaction = {
  all: Storage.get(),

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
    let amount = String(value).replace(/\,/g, "");

    amount = Number(amount);

    return amount;
  },

  formatCurrency(value) {
    let amount = value / 100;

    amount = amount.toLocaleString("pr-BR", { style: "currency", currency: "BRL" });

    return amount;
  },

  formatDate(dateTransaction) {
    function formatDateNumber(date) {
      if (date <= 9) {
        return "0" + date;
      }
      
      return date;
    }

    const date = new Date(dateTransaction);

    const day = formatDateNumber(date.getDate());
    const month = formatDateNumber(date.getMonth() + 1);
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
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

    const date = Utils.formatDate(transaction.date);

    const HTML = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSClass}">${amount}</td>
      <td class="date">${date}</td>
      
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
      date: Date.now(),
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues();

    amount = Utils.formatAmount(amount);

    return {
      description,
      amount,
      date
    };
  }
}

const  App = {
  init() {
    App.checkTransactions();

    Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index);
    });

    DOM.updateBalance();

    Storage.set(Transaction.all);
  },

  reload() {
    Transaction.table.innerHTML = "";
    App.init();
  },

  checkTransactions() {
    const table = document.querySelector("#data-table");
    const message = document.querySelector("#noTransactions");

    if (Transaction.all.length === 0) {
      message.classList.add("active");
      table.classList.remove("active");

      table.style.padding = "0";
    } else {
      message.classList.remove("active");
      table.classList.add("active");
    }
  },
}

App.init();