package com.parkinglot.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StatusResponse {

    private long totalSlots;
    private long occupiedSlots;
    private long availableSlots;
}
