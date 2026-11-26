# pimavn.com rebuild

The effort to move the PiMA Academy website off its Webflow export onto a code-only build, without changing how it looks.

## Language

**Old site**:
The Webflow export in `site/`, as served at pimavn.com before the switch-over. The reference for what the rebuild must look like.
_Avoid_: legacy site, current site, baseline

**Rebuild**:
The new code-only version of pimavn.com that replaces the old site, visually equivalent to it.
_Avoid_: new site, redesign, migration (for the result)

**Switch-over**:
The single moment pimavn.com stops serving the old site and starts serving the rebuild, for every page at once. Before it, visitors only ever see the old site.
_Avoid_: launch, go-live, cutover, migration (for the moment)

**Defect fix**:
A change that removes something broken or superfluous from the old site. It may change what a page looks like, but it never changes brand colour, typography or layout.
_Avoid_: improvement, polish

**Redesign**:
Any change to brand colour, typography or layout, or any new visual style or component. Out of scope for the rebuild; deferred to a separate effort.
_Avoid_: design tweak, cleanup

**Content gap**:
A component, section or page of the old site that is empty or broken only because its content does not exist yet. The rebuild keeps it, out of visitors' sight, so it can be filled later.
_Avoid_: placeholder, stub, empty section

**Contact form**:
The form on several pages through which a visitor sends PiMA their name, contact details and a message.
_Avoid_: email form, registration form, sign-up form

**Submission**:
One message a visitor sends through the contact form.
_Avoid_: lead, response, entry
