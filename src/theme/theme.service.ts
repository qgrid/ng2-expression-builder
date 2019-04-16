import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ThemeService {
    private themeName = '';

    public changed = new EventEmitter<any>();
    public component: any;

    constructor() { }

    get name(): string {
        return this.themeName;
    }

    set name(value: string) {
        if (value !== this.themeName) {
            this.themeName = value;
            this.changed.emit({
                newValue: value,
                oldValue: value
            });
        }
    }
}
