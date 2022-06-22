# dcr-timetraveler

[![Deploy](https://github.com/luau-lang/dcr-timetraveler/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/luau-lang/dcr-timetraveler/actions/workflows/deploy.yml)

[Live on GitHub pages](https://luau-lang.github.io/dcr-timetraveler/).

A debugging tool for the Luau programming language that allows you to step forward and backwards through constraint solving steps, inspecting the state of the scope tree and the constraint graph at each point.

To use this tool, set the Luau fast flag `FFlagDebugLuauLogSolverToJson` to `True`. This will print a JSON blob to stdout whenever the constraint solver runs. You can copy and paste that blob into the "Input" tab and press "Apply", which will parse the input and display a graphical view of each solver step, including the beginning and end states.
