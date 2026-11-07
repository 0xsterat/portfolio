# Static-first with no backend

We keep all content as static files (MDX + JSON) with no database, auth, or Firebase-style view counter, even though the reference site has a live `/api/views` counter. This keeps hosting trivial and avoids secrets, trading away live analytics and comments for a much smaller operational surface.
