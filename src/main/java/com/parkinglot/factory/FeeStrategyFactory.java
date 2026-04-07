package com.parkinglot.factory;

import com.parkinglot.strategy.*;

public class FeeStrategyFactory {

    public static FeeStrategy getStrategy(String type) {

        if (type.equalsIgnoreCase("CAR")) {
            return new CarFeeStrategy();
        } else {
            return new BikeFeeStrategy();
        }
    }
}
