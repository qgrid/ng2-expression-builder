import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

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
}
