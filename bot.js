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


btnLowerPrice = document.getElementById("btnLowerPrice");
btnRaisePrice = document.getElementById("btnRaisePrice");
btnMakePaperclip = document.getElementById("btnMakePaperclip"); 

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
function approximateBestDemand(x) {
    err = 0.07 * x * Math.pow(1.15, x) - clipRate;
    derivative = 0.07 * Math.pow(1.15, x) + 0.07 * x * Math.log(1.15);

    return x - err / derivative;
}

function run() {
    //Match sales with production
    bestDemand = Math.pow(clipRate / 7, 1/1.15);

    if (bestDemand < 100) {
        for (i = 0; i < 5; i ++)
            bestDemand = approximateBestDemand(bestDemand);
    }

    bestMarginCents = Math.ceil(100 * margin * demand / bestDemand);

    console.log(bestMarginCents);

    /*
    if (desiredMarginCents > currentMarginCents) {
        for (i = currentMarginCents; i < desiredMarginCents; i ++)
            btnRaisePrice.click();
    } else if (desiredMarginCents < currentMarginCents) {
        for (i = desiredMarginCents; i < currentMarginCents; i ++)
            btnLowerPrice.click();
    }
    */

    btnMakePaperclip.click();
}

setInterval(run, 100);

