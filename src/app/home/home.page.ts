import { Component } from '@angular/core';
import { DatabaseService } from '../../service/database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  value: string;
  valueFromDatabase: string;

  constructor(private databaseService: DatabaseService) {}

  async sendValueToDatabase() {
    console.log(`value = ${this.value}`);
    await this.databaseService.setValue('value', this.value);

    this.valueFromDatabase = await this.databaseService.getValue('value');
    console.log(`database value = ${this.valueFromDatabase}`);
  }
}
