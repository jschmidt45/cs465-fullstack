import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

@Component({
    selector: 'app-edit-trip',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './edit-trip.component.html',
    styleUrl: './edit-trip.component.css'
})
export class EditTripComponent implements OnInit {
    public editForm!: FormGroup;
    trip!: Trip;
    submitted = false;
    message: string = '';

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private tripDataService: TripDataService
    ) {}

    ngOnInit(): void {
        let tripCode = localStorage.getItem("tripCode");
        if (!tripCode) {
            alert("Something went wrong, couldn't find the tripCode!");
            this.router.navigate(['']);
            return;
        }
        console.log('EditTripComponent::ngOnInit');
        console.log('tripCode:', tripCode);

        this.editForm = this.formBuilder.group({
            _id: [],
            code: [tripCode, Validators.required],
            name: ['', Validators.required],
            length: ['', Validators.required],
            start: ['', Validators.required],
            resort: ['', Validators.required],
            perPerson: ['', Validators.required],
            image: ['', Validators.required],
            description: ['', Validators.required]
        });

        this.tripDataService.getTrip(tripCode).subscribe({
            next: (value: any) => {
                console.log('Trip API Response:', value);
        
                if (value && Array.isArray(value) && value.length > 0) {
                    this.trip = value[0];
                    this.editForm.patchValue(this.trip);
                    this.message = `Trip: ${tripCode} retrieved`;
                } else if (value && typeof value === 'object') {
                    this.trip = value;
                    this.editForm.patchValue(this.trip);
                    this.message = `Trip: ${tripCode} retrieved`;
                } else {
                    this.message = 'No Trip Retrieved!';
                }
        
                console.log(this.message);
            },
            error: (error: any) => {
                console.log('Error:', error);
            }
        });
    }

    public onSubmit() {
        this.submitted = true;
        if (this.editForm.valid) {
            this.tripDataService.updateTrip(this.editForm.value).subscribe({
                next: (value: any) => {
                    console.log(value);
                    this.router.navigate(['']);
                },
                error: (error: any) => {
                    console.log('Error:', error);
                }
            });
        }
    }

    get f() { return this.editForm.controls; }
}
