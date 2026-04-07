package com.parkinglot.strategy;

import com.parkinglot.entity.ParkingSlot;
import com.parkinglot.repository.ParkingSlotRepository;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

public class RandomSlotStrategy implements SlotAllocationStrategy {

    private final ParkingSlotRepository slotRepo;

    public RandomSlotStrategy(ParkingSlotRepository slotRepo) {
        this.slotRepo = slotRepo;
    }

    @Override
    public ParkingSlot allocateSlot(String type) {

        List<ParkingSlot> available = slotRepo.findAll()
                .stream()
                .filter(s -> !s.isOccupied() && s.getType().equalsIgnoreCase(type))
                .collect(Collectors.toList());

        if (available.isEmpty()) {
            throw new RuntimeException("No slots available");
        }

        return available.get(new Random().nextInt(available.size()));
    }
}
