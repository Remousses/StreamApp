import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customStringThreeDots' })
export class CustomStringThreeDots implements PipeTransform {
    transform(value: string): string {
        const maxLength = 50;
        if(value.length < maxLength) {
            return value.trim();
        }

        return value.trim().substr(0, maxLength) + '...';
    }
}