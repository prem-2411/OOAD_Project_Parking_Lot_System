package com.parkinglot.repository;

import com.parkinglot.entity.ParkingSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, String> {

    Optional<ParkingSlot> findFirstByTypeAndOccupiedFalse(String type);
}
