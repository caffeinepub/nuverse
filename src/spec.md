# Specification

## Summary
**Goal:** Remove the VR entry point from the fixed bottom navigation while keeping VR Spaces reachable through AIR module navigation.

**Planned changes:**
- Remove the “VR” tab/button from the fixed bottom navigation and ensure the layout remains intact with no gaps.
- Update tab/view types and MainLayout routing logic to eliminate the bottom-nav “vr” tab concept while keeping VR-related pages reachable via in-module navigation (e.g., AIR/Gaming portal entry points).
- Update the investor guided stepper sequence to remove the VR step so it cycles through remaining bottom navigation modules without errors.

**User-visible outcome:** Users will no longer see a “VR” bottom navigation tab, but can still access VR Spaces via the AIR/Gaming portal flows, and the investor stepper will no longer reference “Next: VR”.
