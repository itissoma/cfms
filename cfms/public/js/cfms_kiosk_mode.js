/**
 * CFMS Kiosk Mode - VERSION 3.0 (Phase 1.1)
 * 
 * v3.0 Changes (Phase 1.1 - Landing Page):
 * - TODO-001: Added landing page redirect logic
 * - TODO-002: JavaScript-based redirect for /me and /app/home
 * - Ensures CFMS Accountant always lands on /cfms-dashboard
 * 
 * Previous features (v2.2):
 * - SIDEBAR: Show Attachments, Tags only
 * - MAIN PAGE: Keep Comments, Hide Activity section and New Email button
 * - CONSOLE: Fixed infinite loop
 * - LOGO: Custom CFMS branding
 */

(function() {
    'use strict';
    
    console.log('🚀 CFMS Kiosk Mode v3.0 (Phase 1.1) initializing...');
    
    // =====================================================
    // 1. LANDING PAGE REDIRECT (NEW - Phase 1.1)
    // =====================================================
    
    /**
     * TODO-001 & TODO-002: Landing Page Redirect
     * Ensures non-admin users land on /cfms-dashboard by default
     * 
     * IMPORTANT: cfms-dashboard is a Web Page, not a DocType
     * Must use window.location.href (not frappe.set_route)
     * to avoid adding /app/ prefix
     */
    function redirectToDefaultPage() {
        const is_system_manager = frappe.user_roles && frappe.user_roles.includes('System Manager');
        
        if (!is_system_manager) {
            const current_route = frappe.get_route();
            const route_str = current_route.join('/');
            const path = window.location.pathname;
            
            // List of pages that should redirect to dashboard
            const redirect_routes = [
                'me',           // My Account page
                'app/home',     // ERPNext home
                'app',          // ERPNext Desk
                ''              // Root/empty route
            ];
            
            // Check if current route needs redirect
            if (redirect_routes.includes(route_str) || 
                path === '/me' || 
                path === '/app' || 
                path === '/app/home') {
                
                console.log(`🔄 CFMS Kiosk: Redirecting from '${route_str}' to /cfms-dashboard`);
                // Use direct URL navigation for Web Page (not frappe.set_route)
                window.location.href = '/cfms-dashboard';
                return true;
            }
        }
        return false;
    }
    
    // Run redirect on page load
    $(document).ready(function() {
        setTimeout(redirectToDefaultPage, 100);
    });
    
    // =====================================================
    // 2. ROUTE MONITORING (Enhanced from v2.2)
    // =====================================================
    
    /**
     * Monitor all route changes and block unauthorized access
     * Enhanced to include landing page redirects
     */
    frappe.router.on('change', function() {
        const current_route = frappe.get_route();
        const route_str = current_route.join('/');
        const is_system_manager = frappe.user_roles.includes('System Manager');
        
        if (!is_system_manager) {
            // Block ERPNext Desk access
            if (route_str === 'app' || route_str.startsWith('app/')) {
                console.log('🚫 CFMS Kiosk: Blocked /app access');
                // Use direct URL navigation for Web Page
                window.location.href = '/cfms-dashboard';
                return false;
            }
            
            // Redirect My Account page
            if (route_str === 'me') {
                console.log('🚫 CFMS Kiosk: Blocked /me access');
                // Use direct URL navigation for Web Page
                window.location.href = '/cfms-dashboard';
                return false;
            }
        }
    });
    
    // =====================================================
    // 3. LOGO CUSTOMIZATION (from v2.2)
    // =====================================================
    
    let logo_already_customized = false;
    
    function customize_navbar_logo() {
        if (logo_already_customized) return;
        
        const is_system_manager = frappe.user_roles.includes('System Manager');
        
        if (!is_system_manager) {
            // Hide ERPNext logos
            const erpnext_logo_selectors = [
                '.navbar-brand img',
                '.navbar-home img',
                'img[src*="erpnext"]'
            ];
            
            erpnext_logo_selectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(logo => {
                    logo.style.display = 'none';
                });
            });
            
            // Add CFMS logo
            const navbar_brand = document.querySelector('.navbar-brand') || document.querySelector('.navbar-home');
            
            if (navbar_brand && !navbar_brand.querySelector('.cfms-custom-logo')) {
                const cfms_logo = document.createElement('div');
                cfms_logo.className = 'cfms-custom-logo';
                cfms_logo.innerHTML = '💰 <strong>CFMS</strong>';
                cfms_logo.style.cssText = 'font-size: 20px; font-weight: bold; color: #333; display: inline-block;';
                
                navbar_brand.insertBefore(cfms_logo, navbar_brand.firstChild);
                console.log('✅ CFMS logo added');
                logo_already_customized = true;
            }
        }
    }
    
    $(document).ready(function() {
        setTimeout(customize_navbar_logo, 500);
    });
    
    // =====================================================
    // 4. SIDEBAR CLEANUP (from v2.2)
    // =====================================================
    
    let cleanup_in_progress = false;
    
    function hide_sidebar_items() {
        if (cleanup_in_progress) {
            return;
        }
        
        cleanup_in_progress = true;
        console.log('🧹 Cleaning sidebar...');
        
        // HIDE these sidebar menus
        const menus_to_hide = [
            '.sidebar-menu.form-assignments',     // Assigned To
            '.sidebar-menu.form-shared',          // Share
            '.sidebar-menu.form-sidebar-stats',   // Follow button
            '.sidebar-menu.followed-by-section',  // Activity (sidebar version)
            '.sidebar-menu.text-muted'            // Metadata (sidebar version)
        ];
        
        let hidden_count = 0;
        
        menus_to_hide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.style.display !== 'none') {
                    element.style.display = 'none';
                    hidden_count++;
                }
            });
        });
        
        if (hidden_count > 0) {
            console.log(`✅ Hidden ${hidden_count} sidebar items`);
        }
        
        cleanup_in_progress = false;
    }
    
    // Initial cleanup
    $(document).ready(function() {
        setTimeout(hide_sidebar_items, 800);
    });
    
    // Watch for sidebar changes
    const sidebar_observer = new MutationObserver(function(mutations) {
        hide_sidebar_items();
    });
    
    $(document).ready(function() {
        setTimeout(function() {
            const sidebar = document.querySelector('.form-sidebar');
            if (sidebar) {
                sidebar_observer.observe(sidebar, {
                    childList: true,
                    subtree: true
                });
                console.log('👁️ Sidebar observer started');
            }
        }, 1000);
    });
    
    // =====================================================
    // 5. MAIN PAGE CLEANUP (from v2.2)
    // =====================================================
    
    let main_cleanup_in_progress = false;
    
    function hide_main_page_items() {
        if (main_cleanup_in_progress) {
            return;
        }
        
        main_cleanup_in_progress = true;
        
        // HIDE these main page elements
        const main_items_to_hide = [
            '.timeline-item',                    // Activity section in main area
            '.comment-box .btn.btn-default',     // New Email button
            '.form-footer .text-muted'           // Metadata in footer
        ];
        
        let hidden_main = 0;
        
        main_items_to_hide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const text = element.textContent.trim().toLowerCase();
                
                // Only hide "Activity" timeline items, not Comments
                if (selector === '.timeline-item' && !text.includes('comment')) {
                    if (element.style.display !== 'none') {
                        element.style.display = 'none';
                        hidden_main++;
                    }
                }
                // Hide "New Email" button
                else if (selector === '.comment-box .btn.btn-default' && text.includes('new email')) {
                    if (element.style.display !== 'none') {
                        element.style.display = 'none';
                        hidden_main++;
                    }
                }
                // Hide metadata
                else if (selector === '.form-footer .text-muted') {
                    if (element.style.display !== 'none') {
                        element.style.display = 'none';
                        hidden_main++;
                    }
                }
            });
        });
        
        if (hidden_main > 0) {
            console.log(`✅ Hidden ${hidden_main} main page items`);
        }
        
        main_cleanup_in_progress = false;
    }
    
    // Initial main cleanup
    $(document).ready(function() {
        setTimeout(hide_main_page_items, 1000);
    });
    
    // Watch for main page changes
    const main_observer = new MutationObserver(function(mutations) {
        hide_main_page_items();
    });
    
    $(document).ready(function() {
        setTimeout(function() {
            const layout_main = document.querySelector('.layout-main');
            if (layout_main) {
                main_observer.observe(layout_main, {
                    childList: true,
                    subtree: true
                });
                console.log('👁️ Main page observer started');
            }
        }, 1200);
    });
    
    console.log('✅ CFMS Kiosk Mode v3.0 (Phase 1.1) loaded successfully');
    
})();
