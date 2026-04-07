package com.parkinglot.strategy;

import com.parkinglot.entity.ParkingSlot;

public interface SlotAllocationStrategy {
    ParkingSlot allocateSlot(String type);
}
