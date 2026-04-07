package com.parkinglot.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ParkingSlot {

    @Id
    @Column(unique = true)
    private String slotNumber;

    private String type;

    private boolean occupied;

    @OneToMany(mappedBy = "slot")
    @JsonIgnore
    private List<Ticket> tickets;
}
