import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Star } from 'lucide-react';

export interface Position3D {
    x: number;
    y: number;
    z: number;
}

export interface SphericalPosition {
    theta: number;
    phi: number;
    radius: number;
}

export interface WorldPosition extends Position3D {
    scale: number;
    zIndex: number;
    isVisible: boolean;
    fadeOpacity: number;
    originalIndex: number;
}

export interface ImageData {
    id: string;
    src: string;
    alt: string;
    title?: string;
    description?: string;
    rating?: number;
    role?: string;
}

export interface SphereImageGridProps {
    images?: ImageData[];
    containerSize?: number;
    sphereRadius?: number;
    dragSensitivity?: number;
    momentumDecay?: number;
    maxRotationSpeed?: number;
    baseImageScale?: number;
    hoverScale?: number;
    perspective?: number;
    autoRotate?: boolean;
    autoRotateSpeed?: number;
    className?: string;
    darkMode?: boolean;
    onImageClick?: (image: ImageData) => void;
}

interface RotationState { x: number; y: number; z: number; }
interface VelocityState { x: number; y: number; }
interface MousePosition { x: number; y: number; }

// ==========================================
// SPHERE MATH UTILITIES
// ==========================================

const SPHERE_MATH = {
    degreesToRadians: (d: number) => d * (Math.PI / 180),
    normalizeAngle: (a: number) => {
        while (a > 180) a -= 360;
        while (a < -180) a += 360;
        return a;
    }
};

// ==========================================
// MAIN COMPONENT
// ==========================================

const SphereImageGrid: React.FC<SphereImageGridProps> = ({
    images = [],
    containerSize = 400,
    sphereRadius = 200,
    dragSensitivity = 0.5,
    momentumDecay = 0.95,
    maxRotationSpeed = 5,
    baseImageScale = 0.12,
    hoverScale = 1.2,
    perspective = 1000,
    autoRotate = false,
    autoRotateSpeed = 0.3,
    className = '',
    darkMode = false,
    onImageClick,
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [rotation, setRotation] = useState<RotationState>({ x: 15, y: 15, z: 0 });
    const [velocity, setVelocity] = useState<VelocityState>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
    const [imagePositions, setImagePositions] = useState<SphericalPosition[]>([]);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const lastMousePos = useRef<MousePosition>({ x: 0, y: 0 });
    const animationFrame = useRef<number | null>(null);
    // tracks whether cursor is over the sphere (used by hover-rotate feature)
    const isHoveringRef = useRef(false);

    const actualSphereRadius = sphereRadius || containerSize * 0.5;
    const baseImageSize = containerSize * baseImageScale;

    const generateSpherePositions = useCallback((): SphericalPosition[] => {
        const positions: SphericalPosition[] = [];
        const n = images.length;
        const goldenRatio = (1 + Math.sqrt(5)) / 2;
        const angleIncrement = 2 * Math.PI / goldenRatio;

        for (let i = 0; i < n; i++) {
            const t = i / n;
            const inclination = Math.acos(1 - 2 * t);
            const azimuth = angleIncrement * i;

            let phi = inclination * (180 / Math.PI);
            let theta = (azimuth * (180 / Math.PI)) % 360;

            const poleBonus = Math.pow(Math.abs(phi - 90) / 90, 0.6) * 35;
            if (phi < 90) phi = Math.max(5, phi - poleBonus);
            else phi = Math.min(175, phi + poleBonus);

            phi = 15 + (phi / 180) * 150;
            const randomOffset = (Math.random() - 0.5) * 20;
            theta = (theta + randomOffset) % 360;
            phi = Math.max(0, Math.min(180, phi + (Math.random() - 0.5) * 10));

            positions.push({ theta, phi, radius: actualSphereRadius });
        }
        return positions;
    }, [images.length, actualSphereRadius]);

    const calculateWorldPositions = useCallback((): WorldPosition[] => {
        return imagePositions.map((pos, index) => {
            const thetaRad = SPHERE_MATH.degreesToRadians(pos.theta);
            const phiRad = SPHERE_MATH.degreesToRadians(pos.phi);
            const rotXRad = SPHERE_MATH.degreesToRadians(rotation.x);
            const rotYRad = SPHERE_MATH.degreesToRadians(rotation.y);

            // Cartesian on sphere
            let x = pos.radius * Math.sin(phiRad) * Math.cos(thetaRad);
            let y = pos.radius * Math.cos(phiRad);
            let z = pos.radius * Math.sin(phiRad) * Math.sin(thetaRad);

            // Y-axis rotation (horizontal drag)
            const x1 = x * Math.cos(rotYRad) + z * Math.sin(rotYRad);
            const z1 = -x * Math.sin(rotYRad) + z * Math.cos(rotYRad);
            x = x1; z = z1;

            // X-axis rotation (vertical drag)
            const y2 = y * Math.cos(rotXRad) - z * Math.sin(rotXRad);
            const z2 = y * Math.sin(rotXRad) + z * Math.cos(rotXRad);
            y = y2; z = z2;

            // ── Scale: depth-only, tight range 0.60 → 1.0  ──────────
            // normalised depth: 0 = back of sphere, 1 = front
            const depthNorm = (z + actualSphereRadius) / (2 * actualSphereRadius);
            const scale = 0.60 + depthNorm * 0.40;   // 0.60 … 1.00

            // ── Opacity: all images visible, back face gently dimmed ──
            // Back of sphere (z < 0) fades to 0.45, front stays 1.0
            const fadeOpacity = z >= 0
                ? 1
                : 0.45 + 0.55 * ((z + actualSphereRadius) / actualSphereRadius);

            return {
                x, y, z,
                scale,
                zIndex: Math.round(1000 + z),
                isVisible: true,       // always render every image
                fadeOpacity: Math.max(0.45, Math.min(1, fadeOpacity)),
                originalIndex: index,
            };
        });
    }, [imagePositions, rotation, actualSphereRadius]);


    const clampSpeed = useCallback((s: number) => Math.max(-maxRotationSpeed, Math.min(maxRotationSpeed, s)), [maxRotationSpeed]);

    const updateMomentum = useCallback(() => {
        if (isDragging) return;
        setVelocity(prev => {
            const nv = { x: prev.x * momentumDecay, y: prev.y * momentumDecay };
            if (!autoRotate && Math.abs(nv.x) < 0.01 && Math.abs(nv.y) < 0.01) return { x: 0, y: 0 };
            return nv;
        });
        setRotation(prev => {
            let newY = prev.y;
            // skip auto-rotate while the user's cursor is driving rotation
            if (autoRotate && !isHoveringRef.current) newY += autoRotateSpeed;
            newY += clampSpeed(velocity.y);
            return {
                x: SPHERE_MATH.normalizeAngle(prev.x + clampSpeed(velocity.x)),
                y: SPHERE_MATH.normalizeAngle(newY),
                z: prev.z
            };
        });
    }, [isDragging, momentumDecay, velocity, clampSpeed, autoRotate, autoRotateSpeed]);

    // ── Hover-move → rotate ────────────────────────────────────────────────
    // Cursor position relative to sphere centre drives continuous rotation.
    // Moving right/left rotates Y-axis; moving up/down rotates X-axis.
    const handleContainerMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging) return;                              // drag takes priority
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        // normalised offset from centre: -1 (left/top) → 0 (centre) → +1 (right/bottom)
        const normX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const normY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        // drive velocity – clipped to maxRotationSpeed by clampSpeed
        setVelocity({
            x: clampSpeed(normY * -1.4),   // up cursor → tilt sphere upward
            y: clampSpeed(normX * 1.4),   // right cursor → spin sphere right
        });
    }, [isDragging, clampSpeed]);

    const handleContainerMouseLeave = useCallback(() => {
        isHoveringRef.current = false;
        if (!isDragging) setVelocity({ x: 0, y: 0 });   // stop hover-drift on leave
    }, [isDragging]);

    const handleContainerMouseEnter = useCallback(() => {
        isHoveringRef.current = true;
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        setVelocity({ x: 0, y: 0 });
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        const delta = { x: -dy * dragSensitivity, y: dx * dragSensitivity };
        setRotation(prev => ({
            x: SPHERE_MATH.normalizeAngle(prev.x + clampSpeed(delta.x)),
            y: SPHERE_MATH.normalizeAngle(prev.y + clampSpeed(delta.y)),
            z: prev.z
        }));
        setVelocity({ x: clampSpeed(delta.x), y: clampSpeed(delta.y) });
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    }, [isDragging, dragSensitivity, clampSpeed]);

    const handleMouseUp = useCallback(() => setIsDragging(false), []);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        const t = e.touches[0];
        setIsDragging(true);
        setVelocity({ x: 0, y: 0 });
        lastMousePos.current = { x: t.clientX, y: t.clientY };
    }, []);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const t = e.touches[0];
        const dx = t.clientX - lastMousePos.current.x;
        const dy = t.clientY - lastMousePos.current.y;
        const delta = { x: -dy * dragSensitivity, y: dx * dragSensitivity };
        setRotation(prev => ({
            x: SPHERE_MATH.normalizeAngle(prev.x + clampSpeed(delta.x)),
            y: SPHERE_MATH.normalizeAngle(prev.y + clampSpeed(delta.y)),
            z: prev.z
        }));
        setVelocity({ x: clampSpeed(delta.x), y: clampSpeed(delta.y) });
        lastMousePos.current = { x: t.clientX, y: t.clientY };
    }, [isDragging, dragSensitivity, clampSpeed]);

    const handleTouchEnd = useCallback(() => setIsDragging(false), []);

    useEffect(() => { setIsMounted(true); }, []);
    useEffect(() => { setImagePositions(generateSpherePositions()); }, [generateSpherePositions]);

    useEffect(() => {
        if (!isMounted) return;
        const animate = () => { updateMomentum(); animationFrame.current = requestAnimationFrame(animate); };
        animationFrame.current = requestAnimationFrame(animate);
        return () => { if (animationFrame.current) cancelAnimationFrame(animationFrame.current); };
    }, [isMounted, updateMomentum]);

    useEffect(() => {
        if (!isMounted) return;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isMounted, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

    const worldPositions = calculateWorldPositions();

    const handleImageClick = useCallback((image: ImageData) => {
        if (onImageClick) onImageClick(image);
        else setSelectedImage(image);
    }, [onImageClick]);

    const renderImageNode = useCallback((image: ImageData, index: number) => {
        const position = worldPositions[index];
        if (!position || !position.isVisible) return null;
        const imageSize = baseImageSize * position.scale;
        const isHovered = hoveredIndex === index;
        const finalScale = isHovered ? Math.min(hoverScale, hoverScale / position.scale) : 1;

        return (
            <div
                key={image.id}
                className="absolute select-none"
                style={{
                    width: `${imageSize}px`,
                    height: `${imageSize}px`,
                    left: `${containerSize / 2 + position.x}px`,
                    top: `${containerSize / 2 + position.y}px`,
                    opacity: position.fadeOpacity,
                    // position & opacity update instantly (no lag during drag)
                    transform: `translate(-50%, -50%) scale(${finalScale})`,
                    // transition ONLY on transform so hover-scale is smooth but drag is instant
                    transition: isDragging ? 'none' : 'transform 0.25s ease-out, opacity 0.15s ease',
                    zIndex: position.zIndex,
                    cursor: isDragging ? 'grabbing' : 'pointer',
                    willChange: 'transform, opacity',
                }}
                onMouseEnter={() => !isDragging && setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => !isDragging && handleImageClick(image)}
            >
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-lg border-2 border-white/20 hover:border-primary/60 transition-colors duration-200">
                    <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                        draggable={false}
                        loading={index < 3 ? 'eager' : 'lazy'}
                    />
                </div>
            </div>
        );
    }, [worldPositions, baseImageSize, containerSize, hoveredIndex, hoverScale, handleImageClick, isDragging]);


    const renderModal = () => {
        if (!selectedImage) return null;
        const stars = selectedImage.rating ?? 5;
        const modalBg = darkMode
            ? 'hsl(222 40% 8% / 0.95)'
            : '#ffffff';
        const textColor = darkMode ? 'hsl(210 40% 90%)' : '#111827';
        const subColor = darkMode ? 'hsl(215 20% 55%)' : '#6b7280';
        const borderColor = darkMode ? 'hsl(222 30% 20%)' : '#e5e7eb';

        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ background: 'rgba(0,0,0,0.55)', animation: 'fadeIn 0.25s ease-out' }}
                onClick={() => setSelectedImage(null)}
            >
                <div
                    className="rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border"
                    style={{
                        background: modalBg,
                        borderColor,
                        animation: 'scaleIn 0.25s ease-out',
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Avatar header */}
                    <div className="flex items-center gap-4 p-5 border-b" style={{ borderColor }}>
                        <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2" style={{ borderColor: 'hsl(217 91% 60% / 0.5)' }}>
                            <img src={selectedImage.src} alt={selectedImage.alt} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="font-semibold text-base" style={{ color: textColor }}>{selectedImage.title}</p>
                            {selectedImage.role && <p className="text-xs mt-0.5" style={{ color: subColor }}>{selectedImage.role}</p>}
                            {/* Stars */}
                            <div className="flex items-center gap-0.5 mt-1.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={12} className={i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} />
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="ml-auto w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                            style={{ background: 'hsl(222 30% 15% / 0.5)', color: subColor }}
                        >
                            <X size={15} />
                        </button>
                    </div>
                    {/* Feedback body */}
                    {selectedImage.description && (
                        <div className="p-5">
                            <p className="text-sm leading-relaxed" style={{ color: subColor }}>"{selectedImage.description}"</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (!isMounted) {
        return (
            <div className="rounded-lg animate-pulse flex items-center justify-center"
                style={{ width: containerSize, height: containerSize, background: 'hsl(222 40% 8%)' }}>
                <div style={{ color: 'hsl(215 20% 45%)' }}>Loading...</div>
            </div>
        );
    }

    if (!images.length) return null;

    return (
        <>
            <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
            <div
                ref={containerRef}
                className={`relative select-none ${className}`}
                style={{
                    width: containerSize,
                    height: containerSize,
                    perspective: `${perspective}px`,
                    cursor: isDragging ? 'grabbing' : 'crosshair',
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleContainerMouseMove}
                onMouseEnter={handleContainerMouseEnter}
                onMouseLeave={handleContainerMouseLeave}
                onTouchStart={handleTouchStart}
            >
                <div className="relative w-full h-full" style={{ zIndex: 10 }}>
                    {images.map((image, index) => renderImageNode(image, index))}
                </div>
            </div>
            {renderModal()}
        </>
    );
};

export default SphereImageGrid;
