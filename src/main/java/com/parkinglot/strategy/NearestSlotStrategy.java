package com.parkinglot.strategy;

import com.parkinglot.entity.ParkingSlot;
import com.parkinglot.repository.ParkingSlotRepository;

import java.util.List;

public class NearestSlotStrategy implements SlotAllocationStrategy {

    private final ParkingSlotRepository slotRepo;

    public NearestSlotStrategy(ParkingSlotRepository slotRepo) {
        this.slotRepo = slotRepo;
    }

    @Override
    public ParkingSlot allocateSlot(String type) {

        List<ParkingSlot> slots = slotRepo.findAll();

        return slots.stream()
                .filter(s -> !s.isOccupied() && s.getType().equalsIgnoreCase(type))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No slots available"));
    }
}
