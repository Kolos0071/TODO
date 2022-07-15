(function() {

    
    
    
    //создаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    //создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        button.classList.add('btn','btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true;

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        input.addEventListener('input',()=>{
            if (input.value !== ''){
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        });

       
    

        return {
            form,
            input,
            button,
        };
    }

    //создаем и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
        
    }

    function createTodoItem(name) {
        let item = document.createElement('li');
        //кнопки помещаем в элемент
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item','d-flex','justify-content-between','align-items-center');
        item.textContent = name;
        item.dataset.name = name;

        buttonGroup.classList.add('btn-group','btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn','btn-danger');
        deleteButton.textContent = 'Удалить';


        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);
        document.querySelector('.btn-primary').disabled = true;
        return {
            item,
            doneButton,
            deleteButton,
        };
    }

   

    function createTodoApp(container, title = 'Список дел', defList = [
        {name: 'Visit Loch Ness',
        done: false,
        },
        {name: 'Wash Dish',
        done: false,
        },
        {name: 'Vacuum Cleaning',
        done: true,
        },
        {name: 'to Draw something',
        done: false,
        },
    ]) {
        if(localStorage.getItem(title) == null){
            localStorage.setItem(title, JSON.stringify(defList))
        }
        
        
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append( todoList);
        if (defList !== undefined){
            for (el of defList) {
                let todoItem = createTodoItem(el.name);
                 if (el.done === true){
                    todoItem.item.classList.toggle('list-group-item-success');
                    todoItem.item.dataset.done = true;
                 } else {
                    todoItem.item.dataset.done = false;
                 }
                todoItem.doneButton.addEventListener('click',()=>{
                    todoItem.item.classList.toggle('list-group-item-success');
                    todoItem.item.dataset.done = true;
                    listRefresh(todoItem.item, title);
                });
                todoItem.deleteButton.addEventListener('click',()=>{
                    if(confirm('Вы уверены?')) {
                        listRefresh(todoItem.item, title, true);
                        todoItem.item.remove();
                    }
                });
    
                todoList.append(todoItem.item); 
            }
        }
        

        todoItemForm.form.addEventListener('submit', (e)=> {
            e.preventDefault();

            if (!todoItemForm.input.value) {
                return;
            }

            let todoItem = createTodoItem(todoItemForm.input.value);

            todoItem.doneButton.addEventListener('click',()=>{
                todoItem.item.classList.toggle('list-group-item-success');
            });

            todoItem.deleteButton.addEventListener('click',()=>{
                if(confirm('Вы уверены?')) {
                    listRefresh(todoItem.item, title, true);
                    todoItem.item.remove();
                    
                }
            });

            todoList.append(todoItem.item);

            curList = JSON.parse(localStorage.getItem(title))
            curList.push({'name':todoItem.item.dataset.name,'done':false})
            localStorage.setItem(title, JSON.stringify(curList))
            

            todoItemForm.input.value = '';
            
        });
    }

    window.createTodoApp = createTodoApp;
    
})();

function listRefresh(element, title, del=false) {
    curList = JSON.parse(localStorage.getItem(title));
    if(del) {
        for (el of curList) {
            if(element.dataset.name == el.name){
                i= curList.indexOf(el);
                curList.splice(i,1);
                console.log(curList);
            }
        }
    }else {
        for (el of curList) {
            if(element.dataset.name == el.name){
                if (el.done) {
                    el.done = false;
    
                }else {
                    el.done = true;
                }
            }
        }
    }
    localStorage.setItem(title, JSON.stringify(curList));
}