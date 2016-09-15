import { Component, Inject, ViewEncapsulation } from '@angular/core'

import { AppActions } from '../../app'
import { TodoList } from './todolist.class'
import { NxtCheckboxComponent, NxtFormService, NxtInputComponent } from '../../modules/nxt-form'
import { TodolistPipe } from './todolist.pipe'

@Component({
    directives: [ NxtCheckboxComponent, NxtInputComponent ],
    encapsulation: ViewEncapsulation.None,
    pipes: [ TodolistPipe ],
    providers: [ NxtFormService ],
    selector: 'todolist',
    styles: [
        require('./_todolist.component.scss'),
    ],
    template: require('./_todolist.component.html'),
})

export class TodolistComponent {
    public todolistInput: string
    public todoList: TodoList[]
    public selectedFilter: string

    // Redux
    private appStore

    constructor (@Inject('AppStore') appStore) {
        this.todolistInput = ''
        this.todoList = []
        this.selectedFilter = 'all'

        this.appStore = appStore
    }

    public ngOnInit () {
        this.appStore.dispatch(AppActions.setLoading(false))
    }

    public onSubmit () {
        let todo = new TodoList()
        todo.completed = false
        todo.editMode = false
        todo.text = this.todolistInput

        this.todoList = [
            ...this.todoList,
            todo,
        ]

        this.todolistInput = ''
    }

    public destroy (index: number) {
        this.todoList.splice(index, 1)
    }

    public tasksLeft () {
        return this.todoList.filter(t => !t.completed).length
    }

    public filter (filter: string) {
        this.selectedFilter = filter
    }

    public editContent (index) {
        this.todoList[index].editMode = true
    }

    public onEdit (index) {
        if (this.todoList[index].text === '') {
            this.destroy(index)
        } else {
            this.todoList[index].editMode = false
        }
    }
}
