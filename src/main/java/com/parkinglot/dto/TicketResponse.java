package com.parkinglot.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TicketResponse {

    private Long ticketId;
    private String vehicleNumber;
    private String slotNumber;
    private String entryTime;
    private String exitTime;
    private double fee;
}
