package com.parkinglot.entity;
import com.parkinglot.entity.Vehicle;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private ParkingSlot slot;

    @ManyToOne
    private Vehicle vehicle;

    private LocalDateTime entryTime;
    private LocalDateTime exitTime;

    private double fee;
}
