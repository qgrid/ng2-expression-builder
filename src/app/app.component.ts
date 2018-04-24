import { Component } from '@angular/core';
import { ConditionBuilderModel } from '../condition-builder/condition-builder.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  getValues = field => [field.title];
  fields = [
    {
      type: 'text',
      key: 'last_name',
      title: 'Last Name'
    },
    {
      type: 'boolean',
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

  model = new ConditionBuilderModel(this.fields, this.getValues);
}
