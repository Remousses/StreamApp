import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customCurrentFolder' })
export class CustomCurrentFolder implements PipeTransform {
    transform(value: string): string {
        let matchValue = value.match(/[^\/]+$/);
        
        if(matchValue != null) {
            return matchValue[0];
        }
        
        return value;
    }
}