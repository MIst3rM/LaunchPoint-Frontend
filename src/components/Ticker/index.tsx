import type { CSSProperties, ReactNode, RefObject, JSX, ReactElement } from 'react'
import { Children, useLayoutEffect, useEffect, useRef, useMemo, createRef, useState, useCallback, cloneElement } from 'react'
import { resize } from '@motionone/dom'
import { useAnimationFrame, useReducedMotion, LayoutGroup } from 'framer-motion'
import { wrap } from 'popmotion'
import { TickerProps } from '../../types'

/* Placeholder Styles */
const containerStyle = {
    display: 'flex',
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    placeItems: 'center',
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    textIndent: 'none'
}

/* Clamp function, used for fadeInset */
const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

const Ticker = ({
    gap = 10,
    padding = 10,
    paddingPerSide,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    speed = 10,
    hoverFactor = 5,
    direction = true,
    alignment,
    fadeOptions = {
        fadeContent: true,
        overflow: false,
        fadeWidth: 25,
        fadeAlpha: 0,
        fadeInset: 0
    },
    // transitionControl = {
    //     type: 'tween',
    //     ease: 'linear',
    //     duration: 10
    // },
    style,
    slots
}: TickerProps) => {

    const {
        fadeContent,
        overflow,
        fadeWidth,
        fadeInset,
        fadeAlpha
    } = fadeOptions

    const paddingValue = paddingPerSide ? `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px` : `${padding}px`

    /* Checks */
    const hasChildren = Children.count(slots) > 0
    const isHorizontal = direction === 'left' || direction === 'right'

    /* Empty state */
    if (!hasChildren || !slots) {
        throw new Error('You must add at least one child to the Ticker component.')
    }

    /* Refs and State */
    const parentRef = useRef<HTMLDivElement>(null)
    const childrenRef = useMemo<[RefObject<HTMLDivElement>, RefObject<HTMLDivElement>]>(() => [createRef(), createRef()], [])
    const [size, setSize] = useState<{ parent: number; children: number }>({
        parent: 0,
        children: 0
    })

    /* Arrays */
    let clonedChildren: ReactNode[] | JSX.Element[]
    let dupedChildren: ReactNode[] | JSX.Element[] = []

    /* Duplicate value */
    let duplicateBy = 0
    let opacity = 0

    if (hasChildren && size.parent) {
        duplicateBy = Math.round(size.parent / size.children * 2) + 1
        opacity = 1
    }

    /* Measure parent and child */
    const measure = useCallback(() => {
        if (hasChildren && parentRef.current) {
            const parentLength = isHorizontal ? parentRef.current.offsetWidth : parentRef.current.offsetHeight
            const start = childrenRef[0].current ? isHorizontal ? childrenRef[0].current.offsetLeft : childrenRef[0].current.offsetTop : 0
            const end = childrenRef[1].current ? isHorizontal ? childrenRef[1].current.offsetLeft + childrenRef[1].current.offsetWidth : childrenRef[1].current.offsetTop + childrenRef[1].current.offsetHeight : 0
            const childrenLength = end - start + gap
            setSize({
                parent: parentLength,
                children: childrenLength
            })
        }
    }, [childrenRef, gap, hasChildren, isHorizontal])

    /* Add refs to first and last child */
    useLayoutEffect(() => {
        measure()
    }, [measure])

    /**
    * Track whether this is the initial resize event. By default this will fire on mount,
    * which we do in the useEffect. We should only fire it on subsequent resizes.
    */
    let initialResize = useRef(true)
    useEffect(() => {
        if (parentRef.current === null) {
            return
        }
        return resize(parentRef.current, ({
            contentSize
        }) => {
            if (!initialResize.current && (contentSize.width || contentSize.height)) {
                measure()
            }

            initialResize.current = false
        })
    }, [measure])

    // @ts-ignore
    clonedChildren = Children.map(slots, (child, index) => {
        let selectedRef = null
        if (index === 0) {
            selectedRef = childrenRef[0]
        }

        if (index === slots.length - 1) {
            selectedRef = childrenRef[1]
        }

        return (
            <LayoutGroup inherit="id">
                <li
                    style={{
                        display: 'contents',
                    }}
                >
                    {cloneElement(child, {
                        key: `cloned-child-${index}`,
                        ref: selectedRef,
                        style: {
                            ...(child.props?.style),
                            // width: widthType ? child.props?.width : '100%',
                            // height: heightType ? child.props?.height : '100%',
                            flexShrink: 0,
                        },
                    }, child.props?.children)}
                </li>
            </LayoutGroup>
        )
    })

    for (let i = 0; i < duplicateBy; i++) {
        dupedChildren = [
            ...dupedChildren,
            ...Children.map(slots, (child, childIndex) => {

                return (
                    <LayoutGroup inherit="id" key={`duped-child-${i}-${childIndex}`}>
                        <li style={{ display: 'contents' }}>
                            {cloneElement(child, {
                                style: {
                                    ...child.props.style,
                                    // width: widthType ? child.props.width : '100%',
                                    // height: heightType ? child.props.height : '100%',
                                    flexShrink: 0
                                }
                            }, child.props.children)}
                        </li>
                    </LayoutGroup>
                )
            })
        ]
    }

    const animateToValue = size.children + size.children * Math.round(size.parent / size.children)
    const transformRef = useRef<HTMLUListElement>(null)
    const initialTime = useRef<number | null>(null)
    const prevTime = useRef<number | null>(null)
    const xOrY = useRef(0)
    const isHover = useRef(false)
    const isReducedMotion = useReducedMotion()

    useAnimationFrame(t => {
        if (!transformRef.current || !animateToValue || isReducedMotion) {
            return
        }

        /**
         * In case this animation is delayed from starting because we're running a bunch
         * of other work, we want to set an initial time rather than counting from 0.
         * That ensures that if the animation is delayed, it starts from the first frame
         * rather than jumping.
         */
        if (initialTime.current === null) {
            initialTime.current = t
        }

        t = t - initialTime.current
        const timeSince = prevTime.current === null ? 0 : t - prevTime.current
        let delta = timeSince * (speed / 1e3)

        if (isHover.current) {
            delta *= hoverFactor
        }

        xOrY.current += delta
        xOrY.current = wrap(0, animateToValue, xOrY.current)
        /* Direction */

        if (direction === 'left') {
            transformRef.current.style.transform = `translateX(-${xOrY.current}px)`
        }

        if (direction === 'right') {
            transformRef.current.style.transform = `translateX(${xOrY.current}px)`
        }

        if (direction === 'top') {
            transformRef.current.style.transform = `translateY(-${xOrY.current}px)`
        }

        if (direction === 'bottom') {
            transformRef.current.style.transform = `translateY(${xOrY.current}px)`
        }

        prevTime.current = t
    })

    /* Fades */
    const fadeDirection = isHorizontal ? 'to right' : 'to bottom'
    const fadeWidthStart = fadeWidth / 2
    const fadeWidthEnd = 100 - fadeWidth / 2
    const fadeInsetStart = clamp(fadeInset, 0, fadeWidthStart)
    const fadeInsetEnd = 100 - fadeInset
    const fadeMask = `linear-gradient(${fadeDirection}, rgba(0, 0, 0, ${fadeAlpha}) ${fadeInsetStart}%, rgba(0, 0, 0, 1) ${fadeWidthStart}%, rgba(0, 0, 0, 1) ${fadeWidthEnd}%, rgba(0, 0, 0, ${fadeAlpha}) ${fadeInsetEnd}%)`

    return (
        <section
            ref={parentRef}
            style={{
                ...containerStyle,
                opacity,
                padding: paddingValue,
                WebkitMaskImage: fadeContent ? fadeMask : undefined,
                MozMaskImage: fadeContent ? fadeMask : undefined,
                maskImage: fadeContent ? fadeMask : undefined,
                overflow: overflow ? 'visible' : 'hidden',
            } as CSSProperties}
        >
            <ul
                ref={transformRef}
                style={{
                    ...containerStyle,
                    gap,
                    top: direction === 'bottom' ? -animateToValue : undefined,
                    left: direction === 'right' ? -animateToValue : undefined,
                    placeItems: alignment,
                    position: 'relative',
                    flexDirection: isHorizontal ? 'row' : 'column',
                    ...style,
                }}
                onMouseEnter={() => (isHover.current = true)}
                onMouseLeave={() => (isHover.current = false)}
            >
                {clonedChildren}
                {dupedChildren}
            </ul>
        </section>
    )
};

export default Ticker;