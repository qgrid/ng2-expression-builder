import { Component, OnInit, ViewChild } from '@angular/core';
import { ConditionBuilderModel } from '../condition-builder/condition-builder.model';
import { ConditionBuilderComponent } from '../condition-builder/condition-builder.component';
import { ISerializationNode } from '../expression-builder/serialization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild(ConditionBuilderComponent, {static: false})
  builder: ConditionBuilderComponent;
  model: ConditionBuilderModel;
  savedCondition: ISerializationNode;
  title = 'app';
  fields = [
    {
      type: 'text',
      key: 'last_name',
      title: 'Last Name'
    },
    {
      type: 'bool',
      key: 'gender',
      title: 'Gender'
    },
    {
      type: 'currency',
      key: 'salary',
      title: 'Salary'
    },
    {
      type: 'date',
      key: 'birth',
      title: 'Birthday'
    },
    {
      type: 'email',
      key: 'email',
      title: 'Email'
    }
  ];

  getValues = field => [field.title];

  ngOnInit() {
    this.model = new ConditionBuilderModel(this.fields, this.getValues);
  }

  save() {
    if (this.builder.save.canExecute()) {
      const result = this.builder.save.execute();
      this.savedCondition = result.node;
    }
  }

  load() {
    if (this.builder.load.canExecute(this.savedCondition)) {
      this.builder.load.execute(this.savedCondition);
    }
  }

  clear() {
    this.builder.reset.execute();
  }
}
