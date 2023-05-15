/*
 *	Paperclipper bot to play Universal Paperclips
 *	Copyright (C) 2023 Sam Peterson <sam.peterson1@icloud.com>
 *	
 *	This program is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *	
 *	This program is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *	GNU General Public License for more details.
 *	
 *	You should have received a copy of the GNU General Public License
 *	along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

const wireSafetyMargin = 10;
const inventorySellTime = 2;

const trustGoals = [6, 47, 25, 74];
trustGoalIndex = 0;

btnLowerPrice = document.getElementById("btnLowerPrice");
btnRaisePrice = document.getElementById("btnRaisePrice");
btnMakePaperclip = document.getElementById("btnMakePaperclip"); 
btnMakeClipper = document.getElementById("btnMakeClipper");
btnBuyWire = document.getElementById("btnBuyWire");
btnExpandMarketing = document.getElementById("btnExpandMarketing");

/*
IMPORTANT EQUATIONS
clipsSold = 7 * min(demand / 100, 1) * pow(demand, 1.15)
marketing = pow(1.1, marketingLvl-1);
demand = ((.8 / margin) * marketing * marketingEffectiveness * demandBoost * (1 + 0.1 * prestigeU);
newDemand = demand * margin / newMargin
*/

function getDemand(newMargin) {
    return demand * margin / newMargin;
}

//newton's method
function getBestDemand(targetSales) {
    bestDemand = Math.pow(targetSales / 7, 1/1.15);

    if (bestDemand < 100) {
        a = Math.log(targetSales * Math.log(1.15) / 0.07);
        bestDemand = (a - Math.log(a - Math.log(a))) / Math.log(1.15);

        for (i = 0; i < 5; i ++) {
            err = 0.07 * bestDemand * Math.pow(1.15, bestDemand) - targetSales;
            derivative = 0.07 * Math.pow(1.15, bestDemand) * (1 + bestDemand * Math.log(1.15));

            bestDemand -= err / derivative;
        }

    }

    return bestDemand;
}

function getBestMargin(targetSales) {
    //Match sales with production
    bestDemand = getBestDemand(targetSales);
    bestMargin = margin * demand / bestDemand;

    //ensure we don't run out of funds
    minMargin = Math.ceil((wireCost + wireSafetyMargin) / wireSupply) / 100;

    if (bestMargin < minMargin) 
        bestMargin = minMargin;

    return bestMargin;
}

function getClipperPayback() {
    targetSales = clipRate + clipperBoost + unsoldClips / inventorySellTime;
    clipperRevenue = (clipRate + clipperBoost) * getBestMargin(targetSales);

    return clipperRevenue / clipperCost;
}

function getMarketingPayback() {
    marketingRevenue = clipRate * (1.1 * margin);

    return marketingRevenue / adCost;
}

function buyProjects() {
    for (i = 1; i < 219; i ++) {
        btn = document.getElementById("projectButton" + i);
        if (btn != null) btn.click();
    }
}

function run() {
    buyProjects();

    bestMarginCents = Math.ceil(getBestMargin(clipRate + unsoldClips / inventorySellTime) * 100);
    currentMarginCents = margin * 100;

    if (bestMarginCents > currentMarginCents) {
        for (i = currentMarginCents; i < bestMarginCents; i ++)
            btnRaisePrice.click();
    } else if (bestMarginCents < currentMarginCents) {
        for (i = bestMarginCents; i < currentMarginCents; i ++)
            btnLowerPrice.click();
    }

    for (i = 0; i < 3; i ++) btnMakePaperclip.click();

    if (wire <= Math.max(0, clipRate / 5))
        btnBuyWire.click();

    clipperPayback = getClipperPayback();
    marketingPayback = getMarketingPayback();

    if (clipperPayback > marketingPayback) {
        //ensure we have enough funds to buy wire before buying clippers
        if (funds + wire * margin - clipperCost > wireCost + wireSafetyMargin)
            btnMakeClipper.click();
    } else {
        //ensure we have enough funds to buy wire before buying marketing
        if (funds + wire * margin - adCost > wireCost + wireSafetyMargin)
            btnExpandMarketing.click();
    }

    if (trustGoalIndex % 2 == 0) {
        if (processors < trustGoals[trustGoalIndex])
            btnAddProc.click();
        else
            trustGoalIndex ++;
    } else {
        if (memory < trustGoals[trustGoalIndex])
            btnAddMem.click();
        else 
            trustGoalIndex ++;
    }
}

setInterval(run, 100);

