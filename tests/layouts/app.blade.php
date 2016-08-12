<!DOCTYPE html>
<html>
  <head>
    <title>
      @yield('title')
    </title>
  </head>
  <body>
    <div class="container">
      @include("layout.navbar.admin.foo", ['data' => 'john'])
    </div>
    <sidebar class="sidebar">
      <h1>hello {{ $name }}</h1>
    </sidebar>
  </body>
</html>