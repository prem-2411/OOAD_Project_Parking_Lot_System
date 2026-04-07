package com.parkinglot.controller;

import com.parkinglot.entity.ParkingSlot;
import com.parkinglot.repository.ParkingSlotRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final ParkingSlotRepository slotRepo;

    public AdminController(ParkingSlotRepository slotRepo) {
        this.slotRepo = slotRepo;
    }

    @PostMapping("/add-slot")
    public ParkingSlot addSlot(
            @RequestParam String slotNumber,
            @RequestParam String type
    ) {
        ParkingSlot slot = new ParkingSlot();
        slot.setSlotNumber(slotNumber);
        slot.setType(type);
        slot.setOccupied(false);

        return slotRepo.save(slot);
    }

    @DeleteMapping("/delete-slot/{slotNumber}")
    public Map<String, String> deleteSlot(@PathVariable String slotNumber) {
        ParkingSlot slot = slotRepo.findById(slotNumber)
                .orElseThrow(() -> new RuntimeException("Slot not found: " + slotNumber));

        if (slot.isOccupied()) {
            throw new RuntimeException("Cannot delete an occupied slot. Please unpark the vehicle first.");
        }

        slotRepo.delete(slot);
        return Map.of("message", "Slot " + slotNumber + " deleted successfully");
    }

    @GetMapping("/slots")
    public List<ParkingSlot> getAllSlots() {
        return slotRepo.findAll();
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        List<ParkingSlot> all = slotRepo.findAll();
        long total = all.size();
        long occupied = all.stream().filter(ParkingSlot::isOccupied).count();
        long available = total - occupied;

        long carSlots = all.stream().filter(s -> "CAR".equalsIgnoreCase(s.getType())).count();
        long bikeSlots = all.stream().filter(s -> "BIKE".equalsIgnoreCase(s.getType())).count();
        long truckSlots = all.stream().filter(s -> "TRUCK".equalsIgnoreCase(s.getType())).count();

        return Map.of(
            "totalSlots", total,
            "occupiedSlots", occupied,
            "availableSlots", available,
            "carSlots", carSlots,
            "bikeSlots", bikeSlots,
            "truckSlots", truckSlots
        );
    }
}
