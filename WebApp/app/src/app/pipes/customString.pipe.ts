import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customString' })
export class CustomString implements PipeTransform {
    transform(value: string): string {
        value = value.replace('-', ' ');
        value = value.replace(/_/g, ' ');
        value = value.replace('  ', ' ');
        value = value[0].toUpperCase() + value.substr(1).toLowerCase();
        
        return value.trim();
    }
}