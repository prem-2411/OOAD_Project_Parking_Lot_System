package com.parkinglot.service;

import com.parkinglot.entity.ParkingSlot;
import com.parkinglot.entity.Ticket;
import com.parkinglot.entity.Vehicle;

import com.parkinglot.repository.*;

import com.parkinglot.factory.FeeStrategyFactory;
import com.parkinglot.factory.SlotStrategyFactory;

import com.parkinglot.strategy.FeeStrategy;
import com.parkinglot.strategy.SlotAllocationStrategy;

import com.parkinglot.dto.TicketResponse;
import com.parkinglot.dto.StatusResponse;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.stream.Collectors;

@Service
public class ParkingService {

    private final VehicleRepository vehicleRepo;
    private final ParkingSlotRepository slotRepo;
    private final TicketRepository ticketRepo;

    public ParkingService(
            VehicleRepository vehicleRepo,
            ParkingSlotRepository slotRepo,
            TicketRepository ticketRepo
    ) {
        this.vehicleRepo = vehicleRepo;
        this.slotRepo = slotRepo;
        this.ticketRepo = ticketRepo;
    }

    // ✅ PARK VEHICLE
    public Ticket parkVehicle(String vehicleNumber, String type, String strategyType) {

        Vehicle vehicle = new Vehicle();
        vehicle.setNumberPlate(vehicleNumber);
        vehicle.setType(type);
        vehicleRepo.save(vehicle);

        SlotAllocationStrategy strategy =
                SlotStrategyFactory.getStrategy(strategyType, slotRepo);

        ParkingSlot slot = strategy.allocateSlot(type);

        slot.setOccupied(true);
        slotRepo.save(slot);

        Ticket ticket = new Ticket();
        ticket.setVehicle(vehicle);
        ticket.setSlot(slot);
        ticket.setEntryTime(LocalDateTime.now());

        return ticketRepo.save(ticket);
    }

    // ✅ UNPARK VEHICLE (returns fee only — kept for backward compat)
    public double unparkVehicle(Long ticketId) {
        return (double) unparkVehicleDetailed(ticketId).get("fee");
    }

    // ✅ UNPARK VEHICLE with full details
    public Map<String, Object> unparkVehicleDetailed(Long ticketId) {

        Ticket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Invalid ticket ID: " + ticketId));

        if (ticket.getExitTime() != null) {
            throw new RuntimeException("This ticket has already been processed.");
        }

        ticket.setExitTime(LocalDateTime.now());

        long hours = java.time.Duration.between(
                ticket.getEntryTime(),
                ticket.getExitTime()
        ).toHours();

        if (hours == 0) hours = 1;

        String type = ticket.getVehicle().getType();
        FeeStrategy strategy = FeeStrategyFactory.getStrategy(type);

        double fee = strategy.calculateFee(hours);
        ticket.setFee(fee);

        ParkingSlot slot = ticket.getSlot();
        slot.setOccupied(false);
        slotRepo.save(slot);

        ticketRepo.save(ticket);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("ticketId", ticket.getId());
        result.put("vehicleNumber", ticket.getVehicle().getNumberPlate());
        result.put("vehicleType", ticket.getVehicle().getType());
        result.put("slotNumber", slot.getSlotNumber());
        result.put("entryTime", ticket.getEntryTime().toString());
        result.put("exitTime", ticket.getExitTime().toString());
        result.put("durationHours", hours);
        result.put("fee", fee);
        return result;
    }

    private TicketResponse mapToDTO(Ticket ticket) {
        return new TicketResponse(
                ticket.getId(),
                ticket.getVehicle().getNumberPlate(),
                ticket.getSlot().getSlotNumber(),
                ticket.getEntryTime().toString(),
                ticket.getExitTime() != null ? ticket.getExitTime().toString() : "ACTIVE",
                ticket.getFee()
        );
    }

    public TicketResponse searchVehicle(String vehicleNumber) {

        Vehicle vehicle = vehicleRepo.findByNumberPlate(vehicleNumber)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        Ticket ticket = ticketRepo.findAll()
                .stream()
                .filter(t -> t.getVehicle().getId().equals(vehicle.getId()) && t.getExitTime() == null)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Active ticket not found"));

        return new TicketResponse(
                ticket.getId(),
                vehicle.getNumberPlate(),
                ticket.getSlot().getSlotNumber(),
                ticket.getEntryTime().toString(),
                ticket.getExitTime() == null ? "ACTIVE" : ticket.getExitTime().toString(),
                ticket.getFee()
        );
    }

    public StatusResponse getParkingStatus() {
        long total = slotRepo.count();
        long occupied = slotRepo.findAll().stream().filter(ParkingSlot::isOccupied).count();
        long available = total - occupied;

        return new StatusResponse(total, occupied, available);
    }

    // ✅ GET ALL ACTIVE TICKETS
    public List<TicketResponse> getActiveTickets() {
        return ticketRepo.findAll()
                .stream()
                .filter(t -> t.getExitTime() == null)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ✅ GET ALL TICKETS (history)
    public List<TicketResponse> getAllTickets() {
        return ticketRepo.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ✅ GET ALL SLOTS
    public List<ParkingSlot> getAllSlots() {
        return slotRepo.findAll();
    }
}
