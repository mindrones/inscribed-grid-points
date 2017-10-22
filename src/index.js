import _ from 'lodash';
import xs from 'xstream';
import fromEvent from 'xstream/extra/fromEvent'
import {run} from '@cycle/run';
import {h, makeDOMDriver} from '@cycle/dom';

import gridView from './gridView';
import triangleView from './triangleView';
import pointsView from './pointsView';

function makeRandomAdimTriangle(withHorizontalSide) {
    return _.chain(3)
        .range()
        .map(i => ({x: Math.random(), y: Math.random()}) )
        .tap(triangle => {
            if (withHorizontalSide) {
                const index = Math.round(Math.random()) + 1;
                triangle[index].y = triangle[index - 1].y;
            }
            return triangle;
        })
        .sortBy(vertex => vertex.y)
        .value();
}

const lineXAtY = ([p1, p2]) => y => {
    if (p2.x === p1.x) {
        return p1.x;
    } else if (p2.y === p1.y) {
        return undefined;
    } else {
        return p1.x + (y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y)
    }
}

const makeSnapBoundary = spacing =>
    (n, i) => {
        const mod = n % spacing;
        return (mod === 0)
            ? n + (i === 1 ? spacing : 0)    // range excludes last element
            : n - mod + spacing
    }

function main({DOM}) {
    const SPACING = 20;
    const RADIUS = SPACING / 3;

    // intent

    const area$ = xs.merge(
        fromEvent(window, 'load'),
        fromEvent(window, 'resize')
    ).map(ev => ({
        width: window.innerWidth,
        height: window.innerHeight,
        padding: RADIUS,
        spacing: SPACING
    }));
    const click$ = DOM.select('svg').events('click');

    const adimTriangle$ =
        click$
        .fold(clicks => clicks + 1, 0)
        .map(n => makeRandomAdimTriangle(n % 4 === 0));

    // model

    const state$ =
        xs.combine(area$, adimTriangle$)
        .map(([area, adimTriangle]) => {
            const {width, height, padding, spacing} = area;

            const triangle = adimTriangle.map(v => ({
                x: padding + (width - 2 * padding) * v.x,
                y: padding + (height - 2 * padding) * v.y
            }));

            const s01 = [triangle[0], triangle[1]];
            const s02 = [triangle[0], triangle[2]];
            const s12 = [triangle[1], triangle[2]];

            const snapBoundary = makeSnapBoundary(spacing);

            const extentAtYInSides = sides =>
                y => _.chain(sides)
                    .map(side => lineXAtY(side)(y))
                    .sort((a, b) => a - b)
                    .map(snapBoundary)
                    .value();

            const extentAtY01 = extentAtYInSides([s01, s02]);
            const extentAtY12 = extentAtYInSides([s02, s12]);

            const pointsInRange01 = (triangle[0].y === triangle[1].y)
                ? (triangle[0].y % spacing === 0)
                    ? _.map(
                        _.range(...[triangle[0].x, triangle[1].x].map(snapBoundary), spacing),
                        x => ({ x, y: triangle[0].y })
                    ) : []
                : _.flatMap(
                    _.range(
                        ...[triangle[0].y, triangle[1].y].map(snapBoundary),
                        spacing
                    ), y =>
                        _.range(...extentAtY01(y), spacing)
                        .map(x => ({x, y}))
                );
            const pointsInRange12 = (triangle[1].y === triangle[2].y)
                ? (triangle[1].y % spacing === 0)
                    ? _.map(
                        _.range(...[triangle[1].x, triangle[2].x].map(snapBoundary), spacing),
                        x => ({ x, y: triangle[1].y })
                    ) : []
                : _.flatMap(
                    _.range(
                        ...[triangle[1].y, triangle[2].y].map(snapBoundary),
                        spacing
                    ), y =>
                        _.range(...extentAtY12(y), spacing)
                        .map(x => ({x, y}))
                );

            const points = [...pointsInRange01, ...pointsInRange12];

            return {
                area,
                triangle,
                grid: {
                    x: _.range(spacing, width, spacing),
                    y: _.range(spacing, height, spacing),
                },
                points
            }
        });

    // view

    const vdom$ = state$.map(state =>
        h('svg', {
            attrs: {
                width: state.area.width,
                height: state.area.height,
            }
        }, [
            gridView(state.grid, state.area.width, state.area.height),
            triangleView(state.triangle, 0.8 * RADIUS),
            pointsView(state.points, RADIUS)
        ])
    );

    return {
        DOM: vdom$,
    };
}

const drivers = {
    DOM: makeDOMDriver('#app'),
};

run(main, drivers);
