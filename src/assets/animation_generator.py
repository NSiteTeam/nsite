# USED TO GENERATE THE LOADING ANIMATION

import os
os.system('cls')

template = """
@keyframes loading$1 {
    0% { @include initialState($2) }   // delay = 25/s
    $3% { @include animationBegin($2) } // $*delay
    $4% { @include atFirstWing() }            // $*delay + 25/s
    $5% { @include atNormalPosition1() }      // $*delay + (360-d)/s
    $6% { @include atNormalPosition2() }     // 5*delay + (360-lastd)/s + $*delay
    $7% { @include willDisappear() }
    $8% { @include disappeared() }
    $9% { @include finishedAndWaiting($2) }    // 5*delay + 360/s + $delay
    100% { @include finished($2) }      // 5*delay + 360/s + 5*delay
}"""

from sympy import Symbol
from sympy.solvers import solve

angles = [
    338,
    306,
    222,
    173,
    145,
    100
]

d = Symbol('d')
s = Symbol('s')
res = solve([5 * d + (360 - angles[-1]) / s + angles[0] / s + 5 * d - 85, 45/s - d])[0]
delay, s = float(res[d]), float(res[s])


for i in range(6):
    j = 1
    o = 5 - i
    print(template
        .replace('$1', str(i+1))
        .replace('$2', str(angles[i]) + 'deg')
        .replace('$3', str(round(o * delay, 1)))
        .replace('$4', str(round(o * delay + 25/s, 1)))
        .replace('$5', str(round(o * delay + (360 - angles[i]) / s, 1)))
        .replace('$6', str(round(5 * delay + (360 - angles[-1]) / s + o * delay, 1)))
        .replace('$7', str(round(5 * delay + (360 - angles[-1]) / s + o * delay + (angles[i] - angles[-1]) / s, 1)))
        .replace('$8', str(round(5 * delay + (360 - angles[-1]) / s + o * delay + (angles[i] - angles[-1] + 20) / s, 1)))
        .replace('$9', str(round(5 * delay + (360 - angles[-1]) / s + angles[i] / s + o * delay, 1)))
    )