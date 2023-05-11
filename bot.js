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

function getDemand(clipPrice) {
    return demand * margin / clipPrice;
}

function run() {
    //Match sales with production
    desiredDemand = Math.pow(clipRate / 7, 1/1.15);
    desiredMarginCents = Math.ceil(100 * margin * demand / desiredDemand);
    currentMarginCents = margin * 100;

    if (desiredMarginCents > currentMarginCents) {
        for (i = currentMarginCents; i < desiredMarginCents; i ++)
            btnRaisePrice.click();
    } else if (desiredMarginCents < currentMarginCents) {
        for (i = desiredMarginCents; i < currentMarginCents; i ++)
            btnLowerPrice.click();
    }
}

setInterval(run, 100);

