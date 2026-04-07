package com.parkinglot.controller;

import com.parkinglot.entity.Ticket;
import com.parkinglot.entity.ParkingSlot;
import com.parkinglot.service.ParkingService;
import org.springframework.web.bind.annotation.*;
import com.parkinglot.dto.TicketResponse;
import com.parkinglot.dto.StatusResponse;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/parking")
public class ParkingController {

    private final ParkingService service;

    public ParkingController(ParkingService service) {
        this.service = service;
    }

    @PostMapping("/park")
    public Ticket park(
            @RequestParam String vehicleNumber,
            @RequestParam String type,
            @RequestParam(defaultValue = "NEAREST") String strategy
    ) {
        return service.parkVehicle(vehicleNumber, type, strategy);
    }

    @PostMapping("/unpark/{id}")
    public Map<String, Object> unpark(@PathVariable Long id) {
        return service.unparkVehicleDetailed(id);
    }

    @GetMapping("/search")
    public TicketResponse search(@RequestParam String vehicleNumber) {
        return service.searchVehicle(vehicleNumber);
    }

    @GetMapping("/status")
    public StatusResponse status() {
        return service.getParkingStatus();
    }

    @GetMapping("/tickets")
    public List<TicketResponse> activeTickets() {
        return service.getActiveTickets();
    }

    @GetMapping("/history")
    public List<TicketResponse> ticketHistory() {
        return service.getAllTickets();
    }

    @GetMapping("/slots")
    public List<ParkingSlot> allSlots() {
        return service.getAllSlots();
    }
}
