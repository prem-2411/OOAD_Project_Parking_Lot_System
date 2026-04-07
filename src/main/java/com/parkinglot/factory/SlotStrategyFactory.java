package com.parkinglot.factory;

import com.parkinglot.repository.ParkingSlotRepository;
import com.parkinglot.strategy.*;

public class SlotStrategyFactory {

    public static SlotAllocationStrategy getStrategy(
            String strategyType,
            ParkingSlotRepository repo
    ) {

        if ("RANDOM".equalsIgnoreCase(strategyType)) {
            return new RandomSlotStrategy(repo);
        }

        return new NearestSlotStrategy(repo); // default
    }
}
