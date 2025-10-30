/**
 * CFMS Kiosk Mode - FINAL VERSION v2.2 (Corrected)
 * 
 * SIDEBAR: Show Attachments, Tags only
 * MAIN PAGE: Keep Comments, Hide Activity section and New Email button
 * CONSOLE: Fixed infinite loop
 */

(function() {
    'use strict';
    
    console.log('🚀 CFMS Kiosk Mode v2.2 (Final) initializing...');
    
    // =====================================================
    // 1. KIOSK MODE - Block ERPNext Desk Access
    // =====================================================
    frappe.router.on('change', function() {
        const current_route = frappe.get_route();
        const route_str = current_route.join('/');
        const is_system_manager = frappe.user_roles.includes('System Manager');
        
        if (route_str === 'app' && !is_system_manager) {
            console.log('🚫 CFMS Kiosk: Blocked /app access');
            frappe.set_route('cfms-dashboard');
            return false;
        }
    });
    
    // =====================================================
    // 2. LOGO CUSTOMIZATION
    // =====================================================
    let logo_already_customized = false;
    
    function customize_navbar_logo() {
        if (logo_already_customized) return;
        
        const is_system_manager = frappe.user_roles.includes('System Manager');
        
        if (!is_system_manager) {
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
    // 3. SIDEBAR CLEANUP
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
                    element.style.visibility = 'hidden';
                    element.style.height = '0';
                    element.style.overflow = 'hidden';
                    element.classList.add('cfms-hidden');
                    hidden_count++;
                }
            });
        });
        
        if (hidden_count > 0) {
            console.log(`✅ Hid ${hidden_count} sidebar items`);
        }
        
        cleanup_in_progress = false;
    }
    
    // =====================================================
    // 4. PAGE CLEANUP - Hide Activity Section & Email Button
    //    KEEP Comments Section Visible
    // =====================================================
    
    function hide_page_elements() {
        console.log('🧹 Cleaning page (Activity & Email)...');
        
        let hidden_count = 0;
        
        // STRATEGY: Find "Activity" heading and hide only that section
        // DO NOT touch "Comments" section
        
        // Method 1: Find Activity heading and hide its siblings
        const headings = document.querySelectorAll('h3, h4, .section-head');
        headings.forEach(heading => {
            const headingText = heading.textContent.trim();
            
            // Only hide Activity section, NOT Comments
            if (headingText === 'Activity') {
                heading.style.display = 'none';
                heading.classList.add('cfms-hidden');
                
                // Hide the content after the Activity heading
                // Stop when we hit another heading (like Comments or next section)
                let nextElement = heading.nextElementSibling;
                while (nextElement) {
                    // Check if this is another section heading
                    const isHeading = nextElement.tagName === 'H3' || 
                                     nextElement.tagName === 'H4' ||
                                     nextElement.classList.contains('section-head');
                    
                    // Stop if we hit Comments or another major section
                    if (isHeading) {
                        const nextText = nextElement.textContent.trim();
                        if (nextText === 'Comments' || nextText === 'Comment') {
                            break;
                        }
                    }
                    
                    // Hide this element (it's part of Activity section)
                    nextElement.style.display = 'none';
                    nextElement.classList.add('cfms-hidden');
                    
                    nextElement = nextElement.nextElementSibling;
                    
                    // Safety: stop after 10 elements to avoid hiding too much
                    if (!nextElement || hidden_count > 10) break;
                }
                
                console.log('🗑️ Hid: Activity section');
                hidden_count++;
            }
        });
        
        // Method 2: Hide specific Activity containers (backup)
        const activity_containers = document.querySelectorAll('.form-footer');
        activity_containers.forEach(container => {
            // Only hide if it doesn't contain Comments
            const hasComments = container.querySelector('.comment-box') || 
                               container.textContent.includes('Type a reply');
            
            if (!hasComments && container.style.display !== 'none') {
                container.style.display = 'none';
                container.classList.add('cfms-hidden');
                hidden_count++;
            }
        });
        
        // Method 3: Hide "+ New Email" button specifically
        const allButtons = document.querySelectorAll('button, a, .btn');
        allButtons.forEach(btn => {
            const text = btn.textContent.trim();
            if (text.includes('New Email') || text.includes('New E-Mail')) {
                btn.style.display = 'none';
                btn.style.visibility = 'hidden';
                btn.classList.add('cfms-hidden');
                console.log('🗑️ Hid: New Email button');
                hidden_count++;
            }
        });
        
        if (hidden_count > 0) {
            console.log(`✅ Hid ${hidden_count} page elements`);
        }
    }
    
    // Run both cleanups when form loads
    frappe.ui.form.on('*', {
        refresh: function(frm) {
            console.log('📋 Form refreshed');
            
            // Sidebar cleanup
            setTimeout(hide_sidebar_items, 200);
            setTimeout(hide_sidebar_items, 600);
            
            // Page cleanup (Activity & Email)
            setTimeout(hide_page_elements, 400);
            setTimeout(hide_page_elements, 900);
            setTimeout(hide_page_elements, 1500);
        }
    });
    
    // =====================================================
    // 5. MUTATION OBSERVER - Watch for Dynamic Changes
    // =====================================================
    
    let observer = null;
    
    function setup_observers() {
        const sidebar = document.querySelector('.form-sidebar');
        
        if (!sidebar) {
            console.log('⏳ Sidebar not found, will retry...');
            return;
        }
        
        if (observer) {
            observer.disconnect();
        }
        
        console.log('👁️ Setting up observers...');
        
        let mutation_timeout;
        
        observer = new MutationObserver(function(mutations) {
            const significant_changes = mutations.some(mutation => {
                return mutation.addedNodes.length > 0 && 
                       Array.from(mutation.addedNodes).some(node => 
                           node.nodeType === 1 && 
                           node.classList && 
                           (node.classList.contains('sidebar-menu') ||
                            node.classList.contains('form-footer'))
                       );
            });
            
            if (significant_changes && !cleanup_in_progress) {
                clearTimeout(mutation_timeout);
                mutation_timeout = setTimeout(function() {
                    console.log('🔄 New content detected');
                    hide_sidebar_items();
                    hide_page_elements();
                }, 300);
            }
        });
        
        observer.observe(sidebar, {
            childList: true,
            subtree: true
        });
        
        console.log('✅ Observers active');
    }
    
    $(document).ready(function() {
        setTimeout(setup_observers, 1000);
        setTimeout(hide_sidebar_items, 1500);
        setTimeout(hide_page_elements, 1500);
    });
    
    frappe.router.on('change', function() {
        setTimeout(setup_observers, 1000);
        setTimeout(hide_sidebar_items, 1200);
        setTimeout(hide_page_elements, 1200);
    });
    
    // =====================================================
    // 6. CSS INJECTION - For Extra Insurance
    // =====================================================
    
    const style = document.createElement('style');
    style.textContent = `
        /* CFMS Sidebar Cleanup */
        .sidebar-menu.form-assignments,
        .sidebar-menu.form-shared,
        .sidebar-menu.form-sidebar-stats,
        .sidebar-menu.followed-by-section,
        .sidebar-menu.text-muted,
        .cfms-hidden {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            overflow: hidden !important;
        }
        
        /* Keep sidebar items visible */
        .sidebar-menu.form-attachments,
        .sidebar-menu.form-tags {
            display: block !important;
        }
        
        /* Keep Comments section visible - DO NOT HIDE */
        .comment-box,
        .new-comment {
            display: block !important;
            visibility: visible !important;
        }
    `;
    document.head.appendChild(style);
    console.log('✅ CSS rules injected');
    
    console.log('✅ CFMS Kiosk Mode v2.2 loaded');
    
})();
